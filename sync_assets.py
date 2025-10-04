import json
import re
from bs4 import BeautifulSoup
import os

# --- 설정 ---
MANIFEST_FILE = "image_manifest.json"
README_FILE = "README.md"
ASSET_LIST_FILE = "ASSET_LIST.md"  # 이미지 목록을 저장할 새 파일
START_MARKER = ""
END_MARKER = ""
# --- 설정 끝 ---

def sync_all_assets_hyperlink():
    # ... (이전 버전의 Manifest 파일 읽기 및 HTML 업데이트 코드는 동일) ...
    # (생략된 코드는 바로 아래 전체 코드에 포함되어 있습니다)

    # README 및 별도 목록 파일 업데이트 로직 수정
    try:
        # (Manifest 파일은 이전 코드와 동일하게 읽었다고 가정)
        with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
        
        # 1. ASSET_LIST.md 파일 생성
        md_table = "# 프로젝트 전체 이미지 목록\n\n"
        md_table += "| HTML 파일 | 자산 ID (Asset ID) | 이미지 파일 경로 |\n|:---|:---|:---|\n"
        for html_file, assets in manifest.items():
            for asset_id, path in assets.items():
                md_table += f"| `{html_file}` | `{asset_id}` | `{path}` |\n"
        
        with open(ASSET_LIST_FILE, 'w', encoding='utf-8') as f:
            f.write(md_table)
        print(f"✅ '{ASSET_LIST_FILE}' 파일에 전체 이미지 목록을 생성/업데이트했습니다.")

        # 2. README.md 파일에는 링크만 삽입
        with open(README_FILE, 'r', encoding='utf-8') as f:
            readme_content = f.read()
            
        link_content = f"➡️ **전체 이미지 목록은 [`{ASSET_LIST_FILE}`]({ASSET_LIST_FILE}) 파일에서 확인하세요.**"
        
        new_readme_content = re.sub(
            f"({re.escape(START_MARKER)}).*?({re.escape(END_MARKER)})",
            f"\\1\n{link_content}\n\\2",
            readme_content,
            flags=re.DOTALL
        )
        
        if readme_content != new_readme_content:
            with open(README_FILE, 'w', encoding='utf-8') as f:
                f.write(new_readme_content)
            print(f"✅ '{README_FILE}' 파일에 이미지 목록 링크를 업데이트했습니다.")
        else:
            print(f"ℹ️ '{README_FILE}' 파일은 이미 최신 상태입니다.")

    except Exception as e:
        print(f"❌ README 또는 목록 파일 처리 중 오류 발생: {e}")

# (이하 전체 스크립트 코드)
def sync_all_assets():
    # 이 부분은 옵션 1의 전체 스크립트와 동일합니다.
    # 단, 마지막에 호출하는 함수를 sync_readme_hyperlink로 변경합니다.
    try:
        with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
        print(f"✅ '{MANIFEST_FILE}' 파일을 성공적으로 읽었습니다.")
    except Exception as e:
        print(f"❌ '{MANIFEST_FILE}' 파일을 읽는 중 오류 발생: {e}")
        return

    # ... (HTML 업데이트 로직은 동일) ...
    for html_file, assets in manifest.items():
        if not os.path.exists(html_file):
            print(f"⚠️ 경고: '{html_file}' 파일을 찾을 수 없어 건너뜁니다.")
            continue
        try:
            with open(html_file, 'r', encoding='utf-8') as f: soup = BeautifulSoup(f, 'html.parser')
            updated_count = 0
            for img_tag in soup.find_all('img', attrs={'data-asset-id': True}):
                asset_id = img_tag['data-asset-id']
                if asset_id in assets:
                    new_src = assets[asset_id]
                    if img_tag.get('src') != new_src: img_tag['src'] = new_src; updated_count += 1
            if updated_count > 0:
                with open(html_file, 'w', encoding='utf-8') as f: f.write(str(soup.prettify(formatter='html5')))
                print(f"  - '{html_file}' 파일의 이미지 {updated_count}개를 업데이트했습니다.")
            else: print(f"  - '{html_file}' 파일은 이미 최신 상태입니다.")
        except Exception as e: print(f"❌ '{html_file}' 파일 처리 중 오류 발생: {e}")

    # README 업데이트 함수 호출
    sync_readme_hyperlink(manifest)

def sync_readme_hyperlink(manifest):
    # 이 함수는 sync_all_assets_hyperlink의 README/목록 업데이트 로직과 동일
    try:
        md_table = "# 프로젝트 전체 이미지 목록\n\n| HTML 파일 | 자산 ID (Asset ID) | 이미지 파일 경로 |\n|:---|:---|:---|\n"
        for html_file, assets in manifest.items():
            for asset_id, path in assets.items(): md_table += f"| `{html_file}` | `{asset_id}` | `{path}` |\n"
        with open(ASSET_LIST_FILE, 'w', encoding='utf-8') as f: f.write(md_table)
        print(f"✅ '{ASSET_LIST_FILE}' 파일에 전체 이미지 목록을 생성/업데이트했습니다.")
        
        with open(README_FILE, 'r', encoding='utf-8') as f: readme_content = f.read()
        link_content = f"➡️ **전체 이미지 목록은 [`{ASSET_LIST_FILE}`]({ASSET_LIST_FILE}) 파일에서 확인하세요.**"
        new_readme_content = re.sub(f"({re.escape(START_MARKER)}).*?({re.escape(END_MARKER)})", f"\\1\n{link_content}\n\\2", readme_content, flags=re.DOTALL)
        if readme_content != new_readme_content:
            with open(README_FILE, 'w', encoding='utf-8') as f: f.write(new_readme_content)
            print(f"✅ '{README_FILE}' 파일에 이미지 목록 링크를 업데이트했습니다.")
        else: print(f"ℹ️ '{README_FILE}' 파일은 이미 최신 상태입니다.")
    except Exception as e:
        print(f"❌ README 또는 목록 파일 처리 중 오류 발생: {e}")

if __name__ == "__main__":
    sync_all_assets()