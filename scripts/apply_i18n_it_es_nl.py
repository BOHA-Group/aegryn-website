#!/usr/bin/env python3
"""
Applique les traductions IT, ES, NL depuis i18n_it_es_nl.json
"""

import json
from pathlib import Path

def deep_merge(target, source):
    """Merge source dict into target dict recursively"""
    for key, value in source.items():
        if key in target and isinstance(target[key], dict) and isinstance(value, dict):
            deep_merge(target[key], value)
        else:
            target[key] = value

def main():
    base_dir = Path(__file__).parent.parent / "i18n" / "messages"
    translations_file = Path(__file__).parent / "i18n_it_es_nl.json"
    
    with open(translations_file, "r", encoding="utf-8") as f:
        translations = json.load(f)
    
    for lang in ["it", "es", "nl"]:
        lang_file = base_dir / f"{lang}.json"
        
        # Charger le fichier existant
        with open(lang_file, "r", encoding="utf-8") as f:
            lang_data = json.load(f)
        
        # Merger les nouvelles traductions
        deep_merge(lang_data, translations[lang])
        
        # Sauvegarder
        with open(lang_file, "w", encoding="utf-8") as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ {lang}.json mis à jour")
    
    print("\n✅ IT, ES, NL mis à jour avec succès")

if __name__ == "__main__":
    main()
