# Presentación ‑ ¿Qué son y cómo funcionan los **Large Language Models (LLM)?**

> Una guía visual y concisa para comprender el origen, la arquitectura y el ciclo de vida de los modelos de lenguaje de gran escala.

---


---

## 1. ¿Qué es un LLM?

*Un **Large Language Model** es una red neuronal basada en la arquitectura Transformer con miles de millones de parámetros, entrenada en grandes corpus de texto para modelar la probabilidad de la siguiente secuencia de tokens.*

* Habilidad principal: **modelado de lenguaje** → predice el siguiente token.
* Capacidad emergente: razonamiento, traducción, síntesis, generación de código.

---

## 2. Orígenes y evolución

### De la atención al lenguaje masivo

```mermaid
timeline
    title Evolución de la atención y los LLM
    2017 : "Attention is All You Need" introduce Transformer
    2018 : GPT‑1 — 117 M parámetros
    2019 : BERT — 340 M parámetros
    2019 : GPT‑2 — 1.5 B parámetros
    2020 : T5 — 11 B parámetros / GPT‑3 — 175 B parámetros
    2022 : PaLM — 540 B parámetros
    2023 : GPT‑4 — ~1 T parámetros (estimado)
    2024 : Gemini Ultra — 1.5 T parámetros (estimado)
```

*La tendencia muestra un crecimiento exponencial del tamaño y la capacidad.*

---

## 3. ¿Attention?

[Attention is all you need](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)
### Qué hace el "attention"?
Imagina que el modelo está leyendo una oración palabra por palabra, pero en vez de mirar solo la palabra actual, puede mirar todas las palabras de la oración y decidir cuáles son más importantes.

#### Ejemplo con frase:
"El gato come pescado"

Cuando el modelo lee la palabra "come", se pregunta:

¿Qué otras palabras me ayudan a entender mejor "come"?

Entonces mira a todas las palabras:

- "el"

- "gato"

- "come"

- "pescado"

 Y decide, por ejemplo:

| Palabra | Importancia para "come" |
| ------- | ----------------------- |
| el      | 10%                     |
| gato    | 40% ✅                   |
| come    | 30%                     |
| pescado | 20% ✅                   |

#### ¿Para qué sirve esto?
Así el modelo entiende mejor el significado de cada palabra en contexto.
Por ejemplo, "gato" (el que come) y "pescado" (lo que come) son más importantes para entender el verbo "come".

#### Resultado final:
El modelo mezcla todas las palabras, pero le da más peso a las importantes para tomar su decisión.
Así puede traducir, responder o continuar la frase de forma mucho más inteligente.


## 4. Anatomía de un LLM

### Flujo de datos interno

```mermaid
flowchart TD
  A[Input] --> B["Tokenización
 (BPE, WordPiece)"]
  B --> C["Embeddings (
vector d_model)"]
  C --> D[Capas \*N Transformer
Self‑Attention & Feed‑Forward]
  D --> E["Proyección a
vocabulario (logits)"]
  E --> F[Softmax → Probabilidades]
  F --> G[Decodificación
siguiente token]
```

### Componentes clave

| Componente                   | Rol                       | Detalle técnico                                                    |
| ---------------------------- | ------------------------- | ------------------------------------------------------------------ |
| **Embeddings**               | Vectorizar tokens         | Dimensión típica 768‑16 384                                        |
| **Self‑Attention**           | Mezclar contexto          | Mecanismo \$\text{softmax}\left(\frac{QK^T}{\sqrt{d\_k}}\right)V\$ |
| **Feed‑Forward**             | Transformación no lineal  | 2‑4× la dimensión del modelo + GELU                                |
| **Normalización & Residual** | Estabilizar entrenamiento | *LayerNorm* + atajos                                               |

---

## 5. Proceso de entrenamiento

```mermaid
flowchart TD
  subgraph Pre-entrenamiento
    A1(Corpus masivo Internet,
libros, código) --> A2[Tokenización]
    A2 --> A3[Objetivo:
Predicción de siguiente token]
    A3 --> A4["Actualización de
peso (Backprop + AdamW)"]
  end
  A4 --> B1{Modelo pre‑entrenado}
  B1 --> C1[Fine‑Tuning
supervisado + Instrucciones]
  C1 --> C2[RLHF / DPO
Alineación con humanos]
  C2 --> D1{Modelo alineado y l
isto para producción}
```

**Pérdida total:** `L = L_MLE + λ·L_RL ; L_RLHF`


---

## 6. Inferencia y *Serving*

```mermaid
sequenceDiagram
    participant Cliente
    participant API LLM
    Cliente->>API LLM: Prompt / Input
    API LLM->>API LLM: Búsqueda de contexto Cálculo de atención
    API LLM-->>Cliente: Tokens de salida (streaming)
```

### Estrategias de decodificación

| Método                 | Control      | Uso típico                    |
| ---------------------- | ------------ | ----------------------------- |
| *Greedy*               | Determinista | Respuestas cortas y factuales |
| *Beam Search*          | Cobertura    | Traducción                    |
| *Nucleus Sampling (p)* | Diversidad   | Creatividad                   |
| *Temperature*          | Aleatoriedad | Brainstorming                 |

### Arquitectura de producción simplificada

```mermaid
flowchart LR
  subgraph Frontend
    FE(Cliente / App)
  end
  subgraph Backend
    GW(API Gateway) --> ORC(Orquestador)
    ORC --> CACHE(KV Cache / Redis)
    ORC --> LLMCore(Servidores GPU / TPUs)
    ORC --> VDB(Vector DB)
  end
  FE --> GW
```

---

## 7. Casos de uso, riesgos y buenas prácticas

### Casos de uso

* **Asistentes conversacionales** (ChatGPT, Gemini, Claude)
* **Programación asistida** (Cursor, GitHub Copilot)
* **Análisis documental y RAG**
* **Traducción y localización**

### Riesgos

| Riesgo                        | Mitigación                                     |
| ----------------------------- | ---------------------------------------------- |
| Alucinaciones                 | RAG + verificación factual                     |
| Filtración de datos sensibles | Enmascarado / hashing antes de envío           |
| *Prompt injection*            | Sanitización y *guardrails*                    |
| Costos de inferencia          | **KV‑Cache**, cuantización, mezcla de expertos |

---

## 8. Glosario

| Término            | Definición breve                                         |
| ------------------ | -------------------------------------------------------- |
| **Token**          | Unidad mínima de entrada (≈ sub‑palabra)                 |
| **Parámetro**      | Valor entrenable de la red                               |
| **Self‑Attention** | Mecanismo que asigna pesos a cada token según relevancia |
| **RLHF**           | *Reinforcement Learning from Human Feedback*             |
| **RAG**            | *Retrieval‑Augmented Generation*                         |

---

## 9. Referencias recomendadas

1. Vaswani et al., *Attention Is All You Need*, 2017.
2. Brown et al., *Language Models are Few‑Shot Learners* (GPT‑3), 2020.
3. OpenAI, *GPT‑4 Technical Report*, 2023.
4. Anthropic, *Constitutional AI*, 2023.
5. Google, *Gemini: A family of highly capable multimodal models*, 2024.

---

