<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2025학년도 중학교 3학년 과학 - 생식과 유전</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            background-color: #f6f8fa;
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            border-radius: 3px;
        }
        ul, ol {
            padding-left: 20px;
        }
        li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

    <h1>2025학년도 중학교 3학년 과학 - 생식과 유전 🧬</h1>
    <p>
        이 저장소는 2025학년도 중학교 3학년 과학 수업의 'V. 생식과 유전' 단원을 위한 교육 자료 및 기술적 자산을 관리하는 공간입니다. 웹 기반의 프레젠테이션 형식으로 제작되어 학생들이 더욱 흥미롭게 학습할 수 있도록 구성되었습니다.
    </p>

    <h2>📚 학습 목차 (Table of Contents)</h2>
    <p>
        각 링크를 클릭하면 해당 단원의 학습 내용을 웹 브라우저에서 바로 확인할 수 있습니다.
    </p>
    <ol>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/intro.html" target="_blank"><strong>인트로 (Intro)</strong></a>: 단원 전체에 대한 소개와 학습 목표를 안내합니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/mitosis.html" target="_blank"><strong>1. 체세포 분열 (Mitosis)</strong></a>: 생장과 재생의 기반이 되는 체세포 분열의 과정과 그 의의를 학습합니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/meiosis.html" target="_blank"><strong>2. 생식세포 분열 (Meiosis)</strong></a>: 유성 생식의 핵심인 감수 분열 과정과 염색체 수 변화를 이해합니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/fert_egg.html" target="_blank"><strong>3. 수정과 발생 (Fertilization & Development)</strong></a>: 생식세포의 결합을 통한 수정 과정과 초기 배아의 발생 과정을 살펴봅니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/mendel1.html" target="_blank"><strong>4. 멘델의 유전 원리 (Mendel's Laws I)</strong></a>: 완두콩 실험을 통해 유전학의 기초가 된 멘델의 유전 원리를 탐구합니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/mendel2.html" target="_blank"><strong>5. 멘델의 유전 원리 심화 (Mendel's Laws II)</strong></a>: 여러 형질의 유전과 중간 유전 등 심화된 유전 원리를 학습합니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/human_genetics.html" target="_blank"><strong>6. 사람의 유전 (Human Genetics)</strong></a>: 사람에게 나타나는 다양한 유전 형질과 가계도 분석 방법을 알아봅니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/genetics_activity.html" target="_blank"><strong>활동: 유전 시뮬레이션 (Genetics Activity)</strong></a>: 가상의 자손을 만들어보며 유전 원리를 직접 체험하는 활동 자료입니다.</li>
        <li><a href="https://rjegjin.github.io/2025-mid3-reproduction-heredity/hidden_further_study.html" target="_blank"><strong>심화 학습 (Further Study)</strong></a>: 본 단원과 관련된 심화 내용을 다룹니다.</li>
    </ol>

    <h2>🛠️ 기술적 구성 (For Developers)</h2>
    <p>
        이 프로젝트는 수업 자료의 효율적인 관리를 위해 몇 가지 자동화 스크립트를 포함하고 있습니다.
    </p>
    <ul>
        <li><strong>주요 파일:</strong>
            <ul>
                <li><code>*.html</code>: 각 차시별 학습 내용을 담고 있는 웹 프레젠테이션 파일입니다.</li>
                <li><code>/images</code>: 수업 자료에 사용되는 모든 이미지 에셋이 저장된 폴더입니다.</li>
                <li><code>ASSET_LIST.md</code>: <code>images</code> 폴더에 있는 모든 이미지의 목록과 미리보기를 제공하는 문서입니다.</li>
                <li><code>image_manifest.json</code>: 이미지 파일 이름과 고유 ID를 매핑하는 JSON 파일로, 스크립트에서 사용됩니다.</li>
            </ul>
        </li>
        <li><strong>Python 스크립트:</strong>
            <ul>
                <li><code>create_initial_manifest.py</code>: <code>images</code> 폴더를 스캔하여 <code>image_manifest.json</code> 파일의 초기 버전을 생성합니다.</li>
                <li><code>sync_assets.py</code>: <code>image_manifest.json</code>을 기준으로 <code>ASSET_LIST.md</code> 파일을 자동으로 업데이트하여 이미지 목록을 최신 상태로 유지합니다.</li>
                <li><code>inject_asset_ids.py</code>: <code>image_manifest.json</code>의 정보를 사용하여 HTML 파일 내의 이미지 태그에 고유 ID를 주입합니다.</li>
            </ul>
        </li>
    </ul>

    <h3>워크플로우 (Workflow)</h3>
    <ol>
        <li>새로운 이미지를 <code>images</code> 폴더에 추가합니다.</li>
        <li><code>create_initial_manifest.py</code>를 실행하여 새로운 이미지를 <code>image_manifest.json</code>에 등록합니다.</li>
        <li><code>sync_assets.py</code>를 실행하여 <code>ASSET_LIST.md</code>를 업데이트합니다.</li>
        <li><code>inject_asset_ids.py</code>를 실행하여 HTML 파일에 이미지 ID를 반영합니다.</li>
    </ol>

    <h2>💡 프로젝트 목표</h2>
    <ul>
        <li>웹 기반의 시각적 자료를 통해 학생들의 학습 흥미와 참여도를 높입니다.</li>
        <li>Git을 활용하여 수업 자료를 체계적으로 버전 관리하고, 여러 장치에서 일관된 작업을 유지합니다.</li>
        <li>Python 스크립트를 통한 자동화로 이미지 자산 관리를 효율화합니다.</li>
    </ul>

</body>
</html>
