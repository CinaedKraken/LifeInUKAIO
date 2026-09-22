import json
import os

with open('C:\\App\\LifeInUK\\Sources\\master_list.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

chunk_size = 45
for i in range(0, len(questions), chunk_size):
    chunk = questions[i:i+chunk_size]
    idx = i // chunk_size
    with open(f'C:\\App\\LifeInUK\\Sources\\master_chunk_{idx}.json', 'w', encoding='utf-8') as f:
        json.dump(chunk, f, indent=2, ensure_ascii=False)
    print(f"Created chunk {idx} with {len(chunk)} questions")
