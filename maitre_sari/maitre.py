from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.llms import Ollama # Usaremos Ollama como ejemplo de LLM local
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# --- CONFIGURACIÓN DE LOS COMPONENTES ---
CHROMA_HOST = "http://localhost:8000"
COLLECTION_NAME = "gemma_rag_collection"

# AJUSTA ESTO a cómo accedes a tu modelo Gemma 3 en Docker
# Si usas Ollama, el puerto por defecto es 11434 y el modelo es 'gemma:2b' o similar
GEMMA_MODEL_NAME = "gemma:2b" 
GEMMA_API_URL = "http://localhost:11434" # <-- ¡AJUSTA ESTE PUERTO Y URL SI ES NECESARIO!

# --- 1. Inicializar el LLM (Gemma 3) ---
# Usamos Ollama porque es una manera común de correr modelos localmente en Docker
llm = Ollama(model=GEMMA_MODEL_NAME, base_url=GEMMA_API_URL)

# --- 2. Inicializar el Modelo de Embeddings y el Vector Store ---
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Conectamos con el vector store que creamos en el Paso 3
vectorstore = Chroma(
    collection_name=COLLECTION_NAME,
    embedding_function=embeddings,
    url=CHROMA_HOST
)

# Creamos el Recuperador (Retriever)
# Buscará los 4 fragmentos (chunks) de documentos más relevantes
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# --- 3. Definir el Prompt para el RAG ---
# Instruimos a Gemma 3 para que use el contexto
CUSTOM_PROMPT = """
Usa el siguiente contexto para responder a la pregunta.
Si no puedes encontrar la respuesta en el contexto, simplemente di "No tengo información específica sobre esto en mi base de conocimiento."
No inventes respuestas.

Contexto: {context}

Pregunta: {question}
"""

QA_CHAIN_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template=CUSTOM_PROMPT,
)

# --- 4. Configurar la Cadena RAG ---
qa_chain = RetrievalQA.from_chain_type(
    llm,
    chain_type="stuff", # "Stuff" simplemente toma todos los docs recuperados y los pone en el prompt.
    retriever=retriever,
    chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
    return_source_documents=True # Para ver de dónde saca la información
)

# --- 5. Bucle de Chat ---
print("--- Chatbot RAG con Gemma 3 Iniciado ---")
print(f"Modelo LLM: {GEMMA_MODEL_NAME} en {GEMMA_API_URL}")
print("Escribe 'salir' para terminar.")

while True:
    query = input("\n> Tu pregunta: ")
    if query.lower() == 'salir':
        break
    
    # Ejecutar la cadena RAG
    print("... Buscando y generando respuesta...")
    result = qa_chain.invoke({"query": query})
    
    # Imprimir el resultado
    print("\n[RESPUESTA DE GEMMA 3]")
    print(result['result'])
    
    print("\n[FUENTES RECUPERADAS]")
    for i, doc in enumerate(result['source_documents']):
        print(f"  {i+1}. Fuente: {Path(doc.metadata['source']).name}")
        print(f"     Contenido (fragmento): {doc.page_content[:150]}...")