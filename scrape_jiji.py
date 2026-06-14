import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://jiji.com.et"
SEARCH_URL = "https://jiji.com.et/addis-ababa/houses-apartments-for-sale"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
}

response = requests.get(SEARCH_URL, headers=headers, timeout=20)

print("Status code:", response.status_code)
print("Page length:", len(response.text))

soup = BeautifulSoup(response.text, "html.parser")

links = []

for a in soup.find_all("a", href=True):
    href = a["href"]

    if "/houses-apartments-for-sale/" in href and href.endswith(".html"):
        full_url = urljoin(BASE_URL, href)
        links.append(full_url)

links = list(dict.fromkeys(links))

print("Listing links found:", len(links))

for link in links[:10]:
    print(link)