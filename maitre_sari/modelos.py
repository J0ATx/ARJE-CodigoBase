# --- Celda de Código 3: Carga de Modelos ---

# 1. Cargar el modelo de embeddings
print("Cargando modelo de embeddings...")
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
print("✅ Modelo de embeddings cargado.")

# 2. Cargar el tokenizador del LLM
print("\nCargando tokenizador de Gemma...")
tokenizer = AutoTokenizer.from_pretrained(LLM_MODEL_NAME)
print("✅ Tokenizador cargado.")

# 3. Cargar el modelo de lenguaje (Gemma) con cuantización
print("\nCargando modelo Gemma (puede tardar unos minutos)...")
llm_model = AutoModelForCausalLM.from_pretrained(
    LLM_MODEL_NAME,
    quantization_config=quantization_config,
    device_map="auto" # Asigna el modelo a la GPU si está disponible
)
print("✅ Modelo Gemma cargado con éxito.")