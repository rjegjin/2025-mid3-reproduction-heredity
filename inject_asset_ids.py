import json
import os
from bs4 import BeautifulSoup

# --- 설정 ---
MANIFEST_FILE = "image_manifest.json"
# --- 설정 끝 ---

def inject_ids_into_html():
    """
    image_manifest.json 파일을 읽어, 해당하는 모든 HTML 파일의 <img> 태그에
    'data-asset-id' 속성을 자동으로 추가하거나 업데이트합니다.
    """
    print("🚀 HTML 파일에 'data-asset-id' 주입을 시작합니다...")

    # 1. Manifest 파일 읽기
    try:
        with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
        print(f"✅ '{MANIFEST_FILE}' 파일을 성공적으로 읽었습니다.")
    except Exception as e:
        print(f"❌ '{MANIFEST_FILE}' 파일을 읽는 중 오류 발생: {e}")
        return

    # 2. Manifest에 명시된 모든 HTML 파일을 순회
    for html_file, assets in manifest.items():
        if not os.path.exists(html_file):
            print(f"⚠️ 경고: '{html_file}' 파일을 찾을 수 없어 건너뜁니다.")
            continue
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, 'html.parser')

            injected_count = 0
            
            # src 경로를 키로, asset_id를 값으로 하는 역방향 맵 생성
            # 예: {"images/1-fixation.jpg": "mitosis_lab_fixation"}
            src_to_id_map = {path: asset_id for asset_id, path in assets.items()}

            for img_tag in soup.find_all('img'):
                src = img_tag.get('src')
                if src and src in src_to_id_map:
                    asset_id = src_to_id_map[src]
                    # data-asset-id가 없거나, 있더라도 값이 다르면 업데이트
                    if img_tag.get('data-asset-id') != asset_id:
                        img_tag['data-asset-id'] = asset_id
                        injected_count += 1
            
            if injected_count > 0:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(str(soup.prettify(formatter='html5')))
                print(f"  - '{html_file}' 파일에 {injected_count}개의 'data-asset-id'를 주입/업데이트했습니다.")
            else:
                 print(f"  - '{html_file}' 파일은 이미 모든 ID가 주입되어 있습니다.")

        except Exception as e:
            print(f"❌ '{html_file}' 파일 처리 중 오류 발생: {e}")

    print("\n✅ 모든 작업이 완료되었습니다.")


if __name__ == "__main__":
    # 스크립트 실행 전 BeautifulSoup 라이브러리 설치 필요
    # 터미널에서: pip install beautifulsoup4
    inject_ids_into_html()