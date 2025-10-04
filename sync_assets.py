import json
from bs4 import BeautifulSoup
import os
import gc

# --- 설정 ---
MANIFEST_FILE = "image_manifest.json"
ASSET_LIST_FILE = "ASSET_LIST.md"  # 이미지 목록을 저장할 파일
# --- 설정 끝 ---

def sync_assets_without_readme_update():
    """
    image_manifest.json을 기준으로 모든 HTML 파일의 이미지 경로를 동기화하고,
    ASSET_LIST.md 파일만 생성/업데이트합니다. README.md는 수정하지 않습니다.
    """
    # 1. Manifest 파일 읽기 (오류 처리 강화)
    try:
        with open(MANIFEST_FILE, 'r', encoding='utf-8', errors='replace') as f:
            manifest = json.load(f)
        print(f"✅ '{MANIFEST_FILE}' 파일을 성공적으로 읽었습니다.")
    except Exception as e:
        print(f"❌ '{MANIFEST_FILE}' 파일을 읽는 중 오류 발생: {e}")
        return

    # 2. 모든 HTML 파일 업데이트 (메모리 관리 포함)
    print("\n🔄 HTML 파일 동기화를 시작합니다...")
    for html_file, assets in manifest.items():
        if not os.path.exists(html_file):
            print(f"⚠️ 경고: '{html_file}' 파일을 찾을 수 없어 건너뜁니다.")
            continue
        try:
            with open(html_file, 'r', encoding='utf-8', errors='replace') as f:
                soup = BeautifulSoup(f, 'lxml')
            
            updated_count = 0
            for img_tag in soup.find_all('img', attrs={'data-asset-id': True}):
                asset_id = img_tag['data-asset-id']
                if asset_id in assets:
                    new_src = assets[asset_id]
                    if img_tag.get('src') != new_src:
                        img_tag['src'] = new_src
                        updated_count += 1
            
            if updated_count > 0:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(str(soup.prettify(formatter='html5')))
                print(f"  - '{html_file}' 파일의 이미지 {updated_count}개를 업데이트했습니다.")
            else:
                 print(f"  - '{html_file}' 파일은 이미 최신 상태입니다.")

        except Exception as e:
            print(f"❌ '{html_file}' 파일 처리 중 오류 발생: {e}")
        finally:
            if 'soup' in locals():
                del soup
            gc.collect()

    # 3. ASSET_LIST.md 파일만 생성/업데이트
    print(f"\n🔄 '{ASSET_LIST_FILE}' 파일 업데이트를 시작합니다...")
    try:
        md_table = "# 🖼️ 프로젝트 전체 이미지 자산 목록\n\n"
        md_table += "이 문서는 `sync_assets.py` 스크립트에 의해 자동으로 생성됩니다.\n\n"
        md_table += "| HTML 파일 | 자산 ID (Asset ID) | 이미지 파일 경로 |\n|:---|:---|:---|\n"
        for html_file, assets in manifest.items():
            for asset_id, path in assets.items():
                md_table += f"| `{html_file}` | `{asset_id}` | `{path}` |\n"
        
        with open(ASSET_LIST_FILE, 'w', encoding='utf-8') as f:
            f.write(md_table)
        print(f"✅ '{ASSET_LIST_FILE}' 파일에 전체 이미지 목록을 성공적으로 기록했습니다.")

    except Exception as e:
        print(f"❌ '{ASSET_LIST_FILE}' 파일 처리 중 오류 발생: {e}")
        
    print("\n✨ 모든 동기화 작업이 완료되었습니다.")


if __name__ == "__main__":
    # 스크립트 실행 전 필요한 라이브러리: pip install lxml beautifulsoup4
    sync_assets_without_readme_update()