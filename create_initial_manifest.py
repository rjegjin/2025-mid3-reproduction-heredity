import json
import os
from bs4 import BeautifulSoup

# --- 설정 ---
# 스캔할 HTML 파일이 있는 폴더 (현재 폴더를 의미)
ROOT_DIRECTORY = "." 
# 생성될 파일명
OUTPUT_FILE = "image_manifest.json" 
# --- 설정 끝 ---

def create_manifest():
    """
    현재 디렉토리와 하위 디렉토리의 모든 HTML 파일을 스캔하여
    이미지 목록이 담긴 image_manifest.json 파일을 생성합니다.
    """
    print("🚀 이미지 Manifest 파일 생성을 시작합니다...")
    
    # 전체 이미지 정보를 담을 딕셔너리
    full_manifest = {}

    # 1. 모든 HTML 파일 찾기
    html_files_to_scan = []
    for root, _, files in os.walk(ROOT_DIRECTORY):
        for file in files:
            if file.endswith(".html"):
                html_files_to_scan.append(os.path.join(root, file))

    if not html_files_to_scan:
        print("❌ 스캔할 HTML 파일을 찾을 수 없습니다. 스크립트가 HTML 파일과 같은 폴더에 있는지 확인하세요.")
        return

    print(f"🔍 총 {len(html_files_to_scan)}개의 HTML 파일을 찾았습니다: {html_files_to_scan}")

    # 2. 각 HTML 파일을 순회하며 이미지 정보 추출
    for html_file in html_files_to_scan:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, 'html.parser')

            image_tags = soup.find_all('img')
            if not image_tags:
                continue # 이미지가 없는 파일은 건너뜀

            # HTML 파일명을 기반으로 Manifest의 최상위 키 생성
            html_key = os.path.basename(html_file)
            full_manifest[html_key] = {}
            
            img_counter = 1
            for img_tag in image_tags:
                src = img_tag.get('src')
                if src and not src.startswith(('http', 'data:')): # 외부 이미지나 데이터 URI는 제외
                    # 예: 'mitosis_img_1', 'mendel1_img_5' 와 같은 고유 ID 생성
                    asset_id = f"{html_key.replace('.html', '')}_img_{img_counter}"
                    full_manifest[html_key][asset_id] = src
                    img_counter += 1
            
            print(f"  - '{html_key}' 파일에서 {img_counter - 1}개의 이미지를 처리했습니다.")

        except Exception as e:
            print(f"❌ '{html_file}' 파일 처리 중 오류 발생: {e}")
    
    # 3. Manifest 파일을 JSON 형식으로 저장
    if not full_manifest:
        print("🤷‍♂️ 프로젝트에서 사용되는 로컬 이미지를 찾지 못했습니다.")
        return

    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            # json.dump를 사용하여 예쁘게 포맷된(들여쓰기) 파일로 저장
            json.dump(full_manifest, f, indent=2, ensure_ascii=False)
        print(f"\n✅ 성공! '{OUTPUT_FILE}' 파일이 생성되었습니다.")
        print("이제 생성된 파일의 자산 ID(asset_id)를 더 의미있는 이름으로 수정하고, 각 HTML 파일에 data-asset-id 속성을 추가해주세요.")

    except Exception as e:
        print(f"❌ '{OUTPUT_FILE}' 파일 저장 중 오류 발생: {e}")


if __name__ == "__main__":
    # 스크립트 실행 전 BeautifulSoup 라이브러리 설치 필요
    # 터미널에서: pip install beautifulsoup4
    create_manifest()