#!/usr/bin/env python3
import os
import re
import argparse
import sys


def sanitize_filename(full_path: str) -> str:
    dirpath, filename = os.path.split(full_path)

    name, ext = os.path.splitext(filename)

    safe_name = name.replace(".", "_")

    new_filename = safe_name + ext

    return os.path.join(dirpath, new_filename)


def find_game_info(config_content):
    """
    Извлекает имя игры и версию из содержимого конфигурационного файла.
    """
    version_match = re.search(
        r'const\s+__VERSION__\s*=\s*["\'](.*?)["\'];', config_content
    )
    if not version_match:
        raise ValueError(
            "Не удалось найти 'const __VERSION__' в конфигурационном файле."
        )
    version = version_match.group(1)

    game_name_match = re.search(
        r'const\s+GAME_NAME\s*=\s*["\'](.*?)["\'];', config_content
    )
    game_name = game_name_match.group(1) if game_name_match else None

    print(f"✅ Найдена версия: '{version}'")
    if game_name:
        print(f"✅ Найдено имя игры: '{game_name}'")

    return game_name, version


def clean_js_content(content):
    """
    Удаляет ES6 import/export из содержимого файла, включая многострочные.
    """
    content = re.sub(
        r"^\s*import\s+.*?from\s+['\"].*?['\"];?\s*$",
        "",
        content,
        flags=re.MULTILINE | re.DOTALL,
    )
    content = re.sub(
        r"^\s*export\s*\{.*?\};?\s*$", "", content, flags=re.MULTILINE | re.DOTALL
    )
    content = re.sub(r"^\s*export\s+(default\s+)?", "", content, flags=re.MULTILINE)

    return content.strip()


def get_files_in_order(directory):
    """
    Находит все .js файлы и сортирует их в правильном порядке для сборки.
    """
    ORDER_PREFERENCE = [
        "config.js",
        "utils.js",
        "Cell.js",
        "Grid.js",
        "MyAnimation.js",
        "AnimationManager.js",
        "Renderer.js",
        "LCG.js",
        "GameEngine.js",
        "index.js",
    ]

    all_js_files = [f for f in os.listdir(directory) if f.endswith(".js")]

    sorted_files = []

    for preferred_file in ORDER_PREFERENCE:
        if preferred_file in all_js_files:
            sorted_files.append(preferred_file)
            all_js_files.remove(preferred_file)

    sorted_files.extend(sorted(all_js_files))

    print(f"... Определен порядок сборки: {', '.join(sorted_files)}")
    return sorted_files


def build_final_script(source_dir, output_dir=None):
    """
    Основная функция для сборки скрипта из множества файлов в директории.
    """
    if not os.path.isdir(source_dir):
        print(f"❌ ОШИБКА: Директория не найдена: '{source_dir}'")
        sys.exit(1)

    print(f"Начинаю обработку директории: {source_dir}")

    files_to_bundle = get_files_in_order(source_dir)
    if not files_to_bundle:
        print("❌ ОШИБКА: В директории не найдено .js файлов для сборки.")
        sys.exit(1)

    config_filename = next((f for f in files_to_bundle if "config" in f.lower()), None)
    if not config_filename:
        print("❌ ОШИБКА: Не найден конфигурационный файл (например, config.js).")
        sys.exit(1)

    with open(os.path.join(source_dir, config_filename), "r", encoding="utf-8") as f:
        config_content = f.read()

    game_name, version = find_game_info(config_content)
    if not game_name:
        game_name = os.path.basename(os.path.abspath(source_dir))
        print(f"⚠️ Имя игры не найдено в конфиге, используется имя папки: '{game_name}'")

    final_content_parts = []

    for filename in files_to_bundle:
        filepath = os.path.join(source_dir, filename)
        print(f"    -> Обрабатываю файл: {filename}")

        with open(filepath, "r", encoding="utf-8") as f:
            file_content = f.read()

        cleaned_content = clean_js_content(file_content)

        if cleaned_content:
            final_content_parts.append(
                f"// ========== START OF FILE {filename} ==========\n"
            )
            final_content_parts.append(cleaned_content)
            final_content_parts.append(
                f"\n// ========== END OF FILE {filename} =========="
            )

    full_script_content = "\n\n".join(final_content_parts)
    full_script_content += "\n\nexport { init, deinit };\n"

    output_filename = f"draw_script_{game_name}_classes_{version}.js"

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        final_output_path = os.path.join(output_dir, output_filename)
        print(f"... Выходная директория указана: '{output_dir}'")

        index_output_path = os.path.join(output_dir, "index.js")
        with open(index_output_path, "w", encoding="utf-8") as f:
            f.write(full_script_content)
    else:
        final_output_path = output_filename

    final_output_path = sanitize_filename(final_output_path)

    with open(final_output_path, "w", encoding="utf-8") as f:
        f.write(full_script_content)

    print("-" * 40)
    print(f"🎉 УСПЕХ! Финальный скрипт собран и сохранен в файл:")
    print(f"   -> {os.path.abspath(final_output_path)}")
    print("-" * 40)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Сборщик JS-проекта из директории в один файл.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "source_directory",
        help="Путь к директории с исходными JS-файлами.\nПример: python build_script.py match3/",
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Директория для сохранения выходного файла.\n(по умолчанию: текущая рабочая директория)",
        default=None,
    )

    args = parser.parse_args()
    build_final_script(args.source_directory, args.output)
