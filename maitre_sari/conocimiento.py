# --- Celda de Código 4: Setup de la Base de Conocimientos ---

# Inicializar cliente de ChromaDB en memoria
client = chromadb.Client()

# Crear una colección (similar a una tabla en una base de datos)
# El nombre de la colección puede ser el que prefieras
collection = client.create_collection(name="knowledge_base")

# --- Documentos para nuestra base de conocimientos (simulación) ---
knowledge_documents = [
    "Política de Reembolsos: Los clientes pueden solicitar un reembolso completo dentro de los 30 días posteriores a la compra. El producto debe estar en su estado original.",
    "Política de Envíos: Realizamos envíos a nivel nacional en un plazo de 3 a 5 días hábiles. El costo de envío estándar es de $5. Los pedidos superiores a $50 tienen envío gratuito.",
    "Horario de Atención al Cliente: Nuestro equipo de soporte está disponible de lunes a viernes, de 9:00 a.m. a 6:00 p.m. El canal principal de contacto es a través de nuestro chat en línea.",
    "Garantía de Productos: Todos nuestros productos electrónicos tienen una garantía limitada de un año que cubre defectos de fabricación. La garantía no cubre daños accidentales."
]

# Generar embeddings para cada documento
print("Generando embeddings para los documentos...")
embeddings = embedding_model.encode(knowledge_documents)

# Agregar los documentos y sus embeddings a la colección
collection.add(
    embeddings=embeddings,
    documents=knowledge_documents,
    ids=[f"doc_{i}" for i in range(len(knowledge_documents))] # Se requiere un ID único por documento
)

print(f"✅ Base de conocimientos creada con {len(knowledge_documents)} documentos.")