# --- Celda de Código 5 (CORREGIDA): Función Principal del RAG ---

def answer_query(query: str, top_k: int = 2):
    """
    Función que implementa el flujo RAG completo con un prompt mejorado
    y un método de decodificación robusto.
    """
    print(f"▶️  Recibida nueva consulta: '{query}'")

    # 1. Generar embedding para la consulta del usuario
    query_embedding = embedding_model.encode([query])

    # 2. Realizar la búsqueda por similitud en la base de conocimientos
    print(f"\n🔎 Buscando {top_k} documentos relevantes en la base de conocimientos...")
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )
    retrieved_context = "\n\n".join(results['documents'][0]) # Usamos doble salto de línea para más claridad
    print("✅ Contexto recuperado:")
    print("--------------------")
    print(retrieved_context)
    print("--------------------")

    # 3. Construir el prompt para el LLM (VERSIÓN MEJORADA Y MÁS DIRECTA)
    # Este formato es más simple y efectivo para modelos de instrucción.
    prompt_template = f"""
<start_of_turn>user
Usa el siguiente contexto para responder la pregunta.

Contexto:
{retrieved_context}

Pregunta:
{query}<end_of_turn>
<start_of_turn>model
"""

    # 4. Generar la respuesta con Gemma
    print("\n🤖 Generando respuesta con Gemma...")
    # Tokenizar el prompt
    inputs = tokenizer(prompt_template, return_tensors="pt", return_attention_mask=False).to("cuda")

    # Generar la salida
    generation_output = llm_model.generate(
        **inputs,
        max_new_tokens=150,
        do_sample=True,
        temperature=0.7,
    )

    # 5. Decodificar la respuesta (MÉTODO MEJORADO)
    # Este método decodifica solo los tokens nuevos que el modelo ha generado.
    # Es más robusto que hacer un split del string.
    output_tokens = generation_output[0]
    input_token_len = inputs["input_ids"].shape[1]
    response_tokens = output_tokens[input_token_len:]

    final_response = tokenizer.decode(response_tokens, skip_special_tokens=True)

    return final_response