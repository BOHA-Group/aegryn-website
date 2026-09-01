#!/usr/bin/env python3
"""
Propagation des nouvelles clés i18n (nav 4 entrées + talent + badges) dans EN, DE, IT, ES, NL
Basé sur les traductions FR comme référence
"""

import json
from pathlib import Path

# Traductions manuelles (qualité professionnelle)
TRANSLATIONS = {
    "en": {
        # Nav 4 entrées
        "ourCraft": "OUR CRAFT",
        "ourSolutions": "OUR SOLUTIONS",
        "ourThinking": "OUR THINKING",
        "whoWeAre": "WHO WE ARE",
        
        # Craft - Build
        "craftBuild": "Build",
        "craftBuildDesc": "Engineering durable tech assets",
        "craftBuildAssets": "Proprietary assets",
        "craftBuildEngineering": "Asset engineering",
        
        # Craft - Support
        "craftSupport": "Support",
        "craftSupportDesc": "Tech & Transaction Advisory",
        "craftSupportAdvisory": "Tech Advisory",
        "craftSupportAcquisition": "Transaction Advisory",
        "craftSupportAlliances": "Partner network",
        "craftSupportExperts": "Expert network",
        
        # Craft - Transact
        "craftTransact": "M&A Transaction",
        "craftTransactDesc": "Certification, sale, acquisition of tech assets",
        "craftTransactGrade": "Certification system",
        "craftTransactCatalog": "Offmarket catalog",
        "craftTransactSell": "Sell an asset",
        "craftTransactBuy": "Become a buyer",
        "craftTransactResults": "Closed transactions",
        
        # Solutions
        "solutionsCore": "CORE",
        "solutionsPortfolio": "PORTFOLIO",
        "solutionsCoreTitle": "Proprietary assets",
        "solutionsCoreDesc": "Designed, developed and operated by Aegryn",
        "solutionsPortfolioTitle": "Portfolio assets",
        "solutionsPortfolioDesc": "Strategic participations and support",
        "solutionsViewAll": "View all assets",
        "solutionsSubblink": "Subblink",
        "solutionsNeediu": "Neediu",
        "solutionsMovtoo": "Movtoo",
        "solutionsPrimiom": "Primiom",
        "solutionsHobconnect": "Hobconnect",
        
        # Thinking
        "thinkingMagazine": "Magazine",
        "thinkingMagazineDesc": "Quarterly publications",
        "thinkingMagazineIssues": "All issues",
        "thinkingBlog": "Blog",
        "thinkingBlogDesc": "Analysis and insights",
        "thinkingBlogArticles": "All articles",
        "thinkingKnowledge": "Knowledge base",
        "thinkingKnowledgeDesc": "Glossary, FAQ, resources",
        "thinkingGlossary": "Glossary",
        "thinkingFAQ": "FAQ",
        
        # Who we are
        "whoGroup": "The group",
        "whoGroupDesc": "History, mission, values",
        "whoAbout": "About Aegryn",
        "whoContact": "Contact us",
        "whoJoin": "Join us",
        "whoJoinDesc": "Careers, talent, partners",
        "whoCareers": "Careers",
        "whoTalent": "Headhunting & Transition",
        "whoAlliances": "Become a partner",
        "talent": "Talent",
        
        # Assets badges
        "badgeCore": "CORE",
        "badgePortfolio": "PORTFOLIO",
        "filterCore": "CORE assets",
        "filterPortfolio": "PORTFOLIO assets",
        "coreDesc": "Designed, developed and operated by Aegryn",
        "portfolioDesc": "Strategic participations and support",
        
        # Footer
        "legal": "© 2026 AEGRYN",
        "col1Title": "Our craft",
        "col1Build": "Build",
        "col1Support": "Support",
        "col1Transact": "M&A Transaction",
        "col2Title": "Our solutions",
        "col2Core": "CORE assets",
        "col2Portfolio": "PORTFOLIO assets",
        "col2ViewAll": "View all assets",
        "col3Title": "Our thinking",
        "col3Magazine": "Magazine",
        "col3Blog": "Blog",
        "col3Glossary": "Glossary",
        "col3FAQ": "FAQ",
        "col4Title": "Who we are",
        "col4About": "About Aegryn",
        "col4Contact": "Contact us",
        "col4Careers": "Careers",
        "col4Talent": "Headhunting & Transition",
        "col4Alliances": "Become a partner",
        "col5Title": "Follow us",
        "col5LinkedIn": "LinkedIn",
        "col5Twitter": "Twitter",
        "col5GitHub": "GitHub",
        "taglines": "Engineered to Last · Rare by selection · Certified to transact",
    },
    "de": {
        # Nav 4 entrées
        "ourCraft": "UNSER HANDWERK",
        "ourSolutions": "UNSERE LÖSUNGEN",
        "ourThinking": "UNSERE ÜBERZEUGUNGEN",
        "whoWeAre": "WER WIR SIND",
        
        # Craft - Build
        "craftBuild": "Aufbauen",
        "craftBuildDesc": "Entwicklung nachhaltiger Tech-Assets",
        "craftBuildAssets": "Eigene Assets",
        "craftBuildEngineering": "Asset-Engineering",
        
        # Craft - Support
        "craftSupport": "Begleiten",
        "craftSupportDesc": "Tech & Transaction Advisory",
        "craftSupportAdvisory": "Tech Advisory",
        "craftSupportAcquisition": "Transaction Advisory",
        "craftSupportAlliances": "Partnernetzwerk",
        "craftSupportExperts": "Expertennetzwerk",
        
        # Craft - Transact
        "craftTransact": "M&A-Transaktion",
        "craftTransactDesc": "Zertifizierung, Verkauf, Erwerb von Tech-Assets",
        "craftTransactGrade": "Zertifizierungssystem",
        "craftTransactCatalog": "Offmarket-Katalog",
        "craftTransactSell": "Asset verkaufen",
        "craftTransactBuy": "Käufer werden",
        "craftTransactResults": "Abgeschlossene Transaktionen",
        
        # Solutions
        "solutionsCore": "CORE",
        "solutionsPortfolio": "PORTFOLIO",
        "solutionsCoreTitle": "Eigene Assets",
        "solutionsCoreDesc": "Von Aegryn konzipiert, entwickelt und betrieben",
        "solutionsPortfolioTitle": "Portfolio-Assets",
        "solutionsPortfolioDesc": "Strategische Beteiligungen und Begleitung",
        "solutionsViewAll": "Alle Assets anzeigen",
        "solutionsSubblink": "Subblink",
        "solutionsNeediu": "Neediu",
        "solutionsMovtoo": "Movtoo",
        "solutionsPrimiom": "Primiom",
        "solutionsHobconnect": "Hobconnect",
        
        # Thinking
        "thinkingMagazine": "Magazin",
        "thinkingMagazineDesc": "Vierteljährliche Publikationen",
        "thinkingMagazineIssues": "Alle Ausgaben",
        "thinkingBlog": "Blog",
        "thinkingBlogDesc": "Analysen und Perspektiven",
        "thinkingBlogArticles": "Alle Artikel",
        "thinkingKnowledge": "Wissensdatenbank",
        "thinkingKnowledgeDesc": "Glossar, FAQ, Ressourcen",
        "thinkingGlossary": "Glossar",
        "thinkingFAQ": "FAQ",
        
        # Who we are
        "whoGroup": "Die Gruppe",
        "whoGroupDesc": "Geschichte, Mission, Werte",
        "whoAbout": "Über Aegryn",
        "whoContact": "Kontakt",
        "whoJoin": "Uns beitreten",
        "whoJoinDesc": "Karriere, Talente, Partner",
        "whoCareers": "Karriere",
        "whoTalent": "Headhunting & Transition",
        "whoAlliances": "Partner werden",
        "talent": "Talent",
        
        # Assets badges
        "badgeCore": "CORE",
        "badgePortfolio": "PORTFOLIO",
        "filterCore": "CORE-Assets",
        "filterPortfolio": "PORTFOLIO-Assets",
        "coreDesc": "Von Aegryn konzipiert, entwickelt und betrieben",
        "portfolioDesc": "Strategische Beteiligungen und Begleitung",
        
        # Footer
        "legal": "© 2026 AEGRYN",
        "col1Title": "Unser Handwerk",
        "col1Build": "Aufbauen",
        "col1Support": "Begleiten",
        "col1Transact": "M&A-Transaktion",
        "col2Title": "Unsere Lösungen",
        "col2Core": "CORE-Assets",
        "col2Portfolio": "PORTFOLIO-Assets",
        "col2ViewAll": "Alle Assets anzeigen",
        "col3Title": "Unsere Überzeugungen",
        "col3Magazine": "Magazin",
        "col3Blog": "Blog",
        "col3Glossary": "Glossar",
        "col3FAQ": "FAQ",
        "col4Title": "Wer wir sind",
        "col4About": "Über Aegryn",
        "col4Contact": "Kontakt",
        "col4Careers": "Karriere",
        "col4Talent": "Headhunting & Transition",
        "col4Alliances": "Partner werden",
        "col5Title": "Folgen Sie uns",
        "col5LinkedIn": "LinkedIn",
        "col5Twitter": "Twitter",
        "col5GitHub": "GitHub",
        "taglines": "Engineered to Last · Rare by selection · Certified to transact",
    },
    # IT, ES, NL suivent le même pattern...
}

def main():
    base_dir = Path(__file__).parent.parent / "i18n" / "messages"
    
    # Charger fr.json comme référence
    with open(base_dir / "fr.json", "r", encoding="utf-8") as f:
        fr_data = json.load(f)
    
    print("✓ fr.json chargé (référence)")
    
    # Pour chaque langue cible
    for lang in ["en", "de"]:  # On commence par EN et DE
        lang_file = base_dir / f"{lang}.json"
        
        with open(lang_file, "r", encoding="utf-8") as f:
            lang_data = json.load(f)
        
        # Mise à jour nav
        if "nav" not in lang_data:
            lang_data["nav"] = {}
        
        for key in TRANSLATIONS[lang]:
            if key.startswith("col") or key in ["legal", "taglines"]:
                # Footer keys
                if "footer" not in lang_data:
                    lang_data["footer"] = {}
                lang_data["footer"][key] = TRANSLATIONS[lang][key]
            elif key in ["badgeCore", "badgePortfolio", "filterCore", "filterPortfolio", "coreDesc", "portfolioDesc"]:
                # Assets page keys
                if "assets" not in lang_data:
                    lang_data["assets"] = {}
                if "page" not in lang_data["assets"]:
                    lang_data["assets"]["page"] = {}
                lang_data["assets"]["page"][key] = TRANSLATIONS[lang][key]
            else:
                # Nav keys
                lang_data["nav"][key] = TRANSLATIONS[lang][key]
        
        # Sauvegarder
        with open(lang_file, "w", encoding="utf-8") as f:
            json.dump(lang_data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ {lang}.json mis à jour")
    
    print("\n✅ Propagation terminée pour EN, DE")
    print("⚠️  IT, ES, NL nécessitent traduction manuelle complète")

if __name__ == "__main__":
    main()
