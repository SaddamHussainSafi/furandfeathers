import re, requests
html = requests.get(\"https://www.meowsoundboard.com/\").text
urls = re.findall(r'https?://[^\\\"']+\\.mp3', html)
print(urls[:10])
