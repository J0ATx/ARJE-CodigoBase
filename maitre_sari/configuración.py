# --- Celda de Código 2: Importaciones y Configuración ---

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from sentence_transformers import SentenceTransformer
import chromadb
import warnings

# Ignorar advertencias no críticas
warnings.filterwarnings("ignore")

# --- Configuración del PoC ---
# Modelo de embeddings para convertir texto a vectores
EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# Modelo de lenguaje grande (LLM) que usaremos
LLM_MODEL_NAME = "google/gemma-3-1b-it"

# Configuración de cuantización para cargar el modelo de forma eficiente
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

print("✅ Módulos importados y configuración definida.")