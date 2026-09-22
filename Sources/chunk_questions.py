import json

with open('C:\\App\\LifeInUK\\Sources\\parsed_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Filter out bad parses just in case
valid_questions = []
for q in questions:
    if len(q['options']) > 0:
        valid_questions.append(q)

batch_size = 24
for i in range(0, len(valid_questions), batch_size):
    batch = valid_questions[i:i+batch_size]
    batch_num = i // batch_size
    with open(f'C:\\App\\LifeInUK\\Sources\\batch_{batch_num}.json', 'w', encoding='utf-8') as f:
        json.dump(batch, f, indent=2, ensure_ascii=False)

print(f"Created {len(valid_questions) // batch_size + 1} batches from {len(valid_questions)} questions.")
