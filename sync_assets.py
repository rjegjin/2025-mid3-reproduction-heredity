import json
import re
from bs4 import BeautifulSoup
import os

# 설정 변수
MANIFEST_FILE = "image_manifest.json"
README_FILE = "README.md"
START_MARKER = ""
END_MARKER = ""

def sync_all_assets():
    # 1. Manifest 파일 읽기
    try:
        with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
        print(f"✅ '{MANIFEST_FILE}' 파일을 성공적으로 읽었습니다.")
    except Exception as e:
        print(f"❌ '{MANIFEST_FILE}' 파일을 읽는 중 오류 발생: {e}")
        return

    # 2. 모든 HTML 파일 업데이트
    for html_file, assets in manifest.items():
        if not os.path.exists(html_file):
            print(f"⚠️ 경고: '{html_file}' 파일을 찾을 수 없어 건너뜁니다.")
            continue
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, 'html.parser')

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

    # 3. README.md 파일 업데이트
    try:
        with open(README_FILE, 'r', encoding='utf-8') as f:
            readme_content = f.read()

        # 전체 이미지 목록으로 마크다운 테이블 생성
        md_table = "| HTML 파일 | 자산 ID (Asset ID) | 이미지 파일 경로 |\n|:---|:---|:---|\n"
        for html_file, assets in manifest.items():
            for asset_id, path in assets.items():
                md_table += f"| `{html_file}` | `{asset_id}` | `{path}` |\n"
        
        new_readme_content = re.sub(
            f"({re.escape(START_MARKER)}).*?({re.escape(END_MARKER)})",
            f"\\1\n{md_table}\n\\2",
            readme_content,
            flags=re.DOTALL
        )
        
        if readme_content != new_readme_content:
            with open(README_FILE, 'w', encoding='utf-8') as f:
                f.write(new_readme_content)
            print(f"✅ '{README_FILE}' 파일의 전체 이미지 목록을 업데이트했습니다.")
        else:
            print(f"ℹ️ '{README_FILE}' 파일은 이미 최신 상태입니다.")
            
    except Exception as e:
        print(f"❌ '{README_FILE}' 파일 처리 중 오류 발생: {e}")


if __name__ == "__main__":
    # 스크립트 실행 전 BeautifulSoup 라이브러리 설치 필요
    # 터미널에서: pip install beautifulsoup4
    sync_all_assets()