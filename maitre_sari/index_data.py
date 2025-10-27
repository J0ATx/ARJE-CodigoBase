from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
from pathlib import Path

# --- CONFIGURACIÓN ---
DOC_PATH = "conocimiento"  # <-- ¡CAMBIA ESTO A LA RUTA DE TUS DOCUMENTOS!
CHROMA_HOST = "http://localhost:8000"
COLLECTION_NAME = "gemma_rag_collection"

def create_index():
    print("1. Cargando documentos...")
    
    # Carga todos los PDF y TXT del directorio
    pdf_loader = DirectoryLoader(DOC_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader)
    txt_loader = DirectoryLoader(DOC_PATH, glob="**/*.txt")
    
    documents = []
    documents.extend(pdf_loader.load())
    documents.extend(txt_loader.load())
    
    if not documents:
        print(f"¡ADVERTENCIA! No se encontraron documentos en {DOC_PATH}. Asegúrate de que la ruta sea correcta.")
        return

    print(f"   -> Documentos cargados: {len(documents)}")

    # 2. Fragmentación (Chunking)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    texts = text_splitter.split_documents(documents)
    print(f"   -> Fragmentos (chunks) creados: {len(texts)}")

    # 3. Modelo de Embeddings
    # Este es un modelo de embeddings ligero y open-source
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # 4. Almacenamiento en ChromaDB
    print(f"4. Creando y almacenando embeddings en ChromaDB ({COLLECTION_NAME})...")
    
    # Nos conectamos al servidor de Chroma que levantamos en Docker
    Chroma.from_documents(
        texts,
        embeddings,
        collection_name=COLLECTION_NAME,
        url=CHROMA_HOST  # Apunta al contenedor de Docker
    )
    
    print("   -> ¡Indexación completada! El índice de conocimiento está listo.")

if __name__ == "__main__":
    create_index()