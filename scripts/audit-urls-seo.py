#!/usr/bin/env python3
"""
Audit URLs/SEO/Slugs pour Aegryn
Vérifie:
- Cohérence des URLs
- Métadonnées SEO (title, description)
- Slugs corrects
- Pages manquantes
- Redirections nécessaires
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

# Racine du projet
ROOT = Path(__file__).parent.parent
APP_DIR = ROOT / "app" / "[locale]"

def extract_metadata(file_path: Path) -> Dict[str, str]:
    """Extrait les métadonnées d'une page Next.js"""
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Extraire title
        title_match = re.search(r'title:\s*[\'"`]([^\'"`]+)[\'"`]', content)
        title = title_match.group(1) if title_match else "NO_TITLE"
        
        # Extraire description
        desc_match = re.search(r'description:\s*[\'"`]([^\'"`]+)[\'"`]', content)
        description = desc_match.group(1) if desc_match else "NO_DESC"
        
        return {
            "title": title,
            "description": description,
            "has_metadata": "generateMetadata" in content or "Metadata" in content
        }
    except Exception as e:
        return {"title": "ERROR", "description": str(e), "has_metadata": False}

def get_all_pages() -> List[Tuple[str, Path]]:
    """Liste toutes les pages du site"""
    pages = []
    for page_file in APP_DIR.rglob("page.tsx"):
        # Construire l'URL relative
        rel_path = page_file.relative_to(APP_DIR)
        url_parts = list(rel_path.parts[:-1])  # Retirer "page.tsx"
        
        # Construire l'URL
        if not url_parts:
            url = "/"
        else:
            url = "/" + "/".join(url_parts)
        
        pages.append((url, page_file))
    
    return sorted(pages)

def check_url_consistency(pages: List[Tuple[str, Path]]) -> List[str]:
    """Vérifie la cohérence des URLs"""
    issues = []
    
    for url, path in pages:
        # Vérifier les URLs avec majuscules
        if any(c.isupper() for c in url):
            issues.append(f"❌ URL avec majuscule: {url}")
        
        # Vérifier les underscores (préférer tirets)
        if "_" in url and not url.startswith("/admin"):
            issues.append(f"⚠️  Underscore dans URL: {url} (préférer tirets)")
        
        # Vérifier les URLs trop longues
        if len(url) > 80:
            issues.append(f"⚠️  URL trop longue ({len(url)} chars): {url}")
    
    return issues

def check_seo_metadata(pages: List[Tuple[str, Path]]) -> List[str]:
    """Vérifie les métadonnées SEO"""
    issues = []
    
    for url, path in pages:
        # Ignorer les pages admin/api
        if "/admin/" in url or "/api/" in url:
            continue
        
        metadata = extract_metadata(path)
        
        if not metadata["has_metadata"]:
            issues.append(f"❌ Pas de métadonnées: {url}")
        
        if metadata["title"] == "NO_TITLE":
            issues.append(f"❌ Pas de title: {url}")
        
        if metadata["description"] == "NO_DESC":
            issues.append(f"❌ Pas de description: {url}")
        
        # Vérifier longueur title (50-60 chars optimal)
        if metadata["title"] != "NO_TITLE":
            title_len = len(metadata["title"])
            if title_len > 70:
                issues.append(f"⚠️  Title trop long ({title_len} chars): {url}")
            elif title_len < 30:
                issues.append(f"⚠️  Title trop court ({title_len} chars): {url}")
        
        # Vérifier longueur description (150-160 chars optimal)
        if metadata["description"] != "NO_DESC":
            desc_len = len(metadata["description"])
            if desc_len > 200:
                issues.append(f"⚠️  Description trop longue ({desc_len} chars): {url}")
            elif desc_len < 100:
                issues.append(f"⚠️  Description trop courte ({desc_len} chars): {url}")
    
    return issues

def check_missing_pages() -> List[str]:
    """Vérifie les pages manquantes importantes"""
    required_pages = [
        "/",
        "/about",
        "/contact",
        "/services/build",
        "/advisory",
        "/transact",
        "/grade",
        "/talent",
        "/assets",
        "/magazine",
        "/blog",
        "/privacy",
        "/terms/use",
        "/sitemap",
    ]
    
    existing_pages = [url for url, _ in get_all_pages()]
    missing = []
    
    for required in required_pages:
        if required not in existing_pages:
            missing.append(f"❌ Page manquante: {required}")
    
    return missing

def main():
    print("🔍 AUDIT URLs/SEO/Slugs - Aegryn\n")
    print("=" * 60)
    
    # 1. Lister toutes les pages
    pages = get_all_pages()
    print(f"\n📄 Total pages trouvées: {len(pages)}\n")
    
    # 2. Vérifier cohérence URLs
    print("🔗 Vérification cohérence URLs...")
    url_issues = check_url_consistency(pages)
    if url_issues:
        for issue in url_issues:
            print(f"  {issue}")
    else:
        print("  ✅ Toutes les URLs sont cohérentes")
    
    # 3. Vérifier métadonnées SEO
    print("\n🎯 Vérification métadonnées SEO...")
    seo_issues = check_seo_metadata(pages)
    if seo_issues:
        for issue in seo_issues[:20]:  # Limiter à 20 pour lisibilité
            print(f"  {issue}")
        if len(seo_issues) > 20:
            print(f"  ... et {len(seo_issues) - 20} autres problèmes")
    else:
        print("  ✅ Toutes les métadonnées sont présentes")
    
    # 4. Vérifier pages manquantes
    print("\n📋 Vérification pages essentielles...")
    missing = check_missing_pages()
    if missing:
        for issue in missing:
            print(f"  {issue}")
    else:
        print("  ✅ Toutes les pages essentielles existent")
    
    # 5. Résumé
    total_issues = len(url_issues) + len(seo_issues) + len(missing)
    print("\n" + "=" * 60)
    print(f"📊 RÉSUMÉ: {total_issues} problèmes détectés")
    print(f"   - URLs: {len(url_issues)}")
    print(f"   - SEO: {len(seo_issues)}")
    print(f"   - Pages manquantes: {len(missing)}")
    
    if total_issues == 0:
        print("\n✅ Audit complet : AUCUN PROBLÈME !")
    else:
        print(f"\n⚠️  Audit complet : {total_issues} problèmes à corriger")
    
    return 0 if total_issues == 0 else 1

if __name__ == "__main__":
    exit(main())
