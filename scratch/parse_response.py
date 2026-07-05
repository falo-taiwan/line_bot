import json

with open('/Users/force/.gemini/antigravity/brain/bb77f773-083c-402c-be31-9dc1daa2c05a/.system_generated/steps/5408/content.md', 'r') as f:
    lines = f.readlines()

json_line = None
for line in lines:
    if line.strip().startswith('{"ok":true'):
        json_line = line.strip()
        break

if json_line:
    data = json.loads(json_line)
    records = data.get('data', [])
    print(f"Total records in query: {len(records)}")
    records_sorted = sorted(records, key=lambda x: int(x.get('id', 0)), reverse=True)
    distinct_msgs = []
    seen = set()
    for r in records_sorted:
        msg_id = r.get('message_id')
        if msg_id not in seen:
            seen.add(msg_id)
            distinct_msgs.append(r)
    
    print("\nLatest distinct messages:")
    for idx, r in enumerate(distinct_msgs[:15]):
        msg_id = r.get('message_id')
        mtype = r.get('message_type')
        text = str(r.get('text_content') or '')
        cap_at = r.get('captured_at')
        print(f"Msg {idx+1}: ID={r.get('id')} msg_id={msg_id} type={mtype} text={text[:60]} cap={cap_at}")
else:
    print("JSON line not found")
