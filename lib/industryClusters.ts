/**
 * lib/industryClusters.ts — Taxonomie etendue du CIFSO Valuation Index
 *
 * Couche de presentation complementaire a lib/indexTaxonomy.ts : 5 industries
 * (identiques a /industries, data/industries.ts) -> 22 clusters (memes clusters que
 * les pages /industries, labels repris a l'identique dans les 6 langues) -> 200+
 * verticaux tech-driven (composante technologique de chaque cluster, meme s'il n'est
 * pas lui-meme 100% tech). Verticaux en ANGLAIS UNIQUEMENT pour le moment (voir note
 * affichee sur la page) — n'affecte PAS le moteur de calcul des multiples
 * (lib/cifsoIndex.ts, lib/cifsoValuation.ts), qui reste ancre sur les 5 industries.
 */
import type { ClusterKey } from '@/lib/cifsoValuation'
import type { IndexLocale } from '@/lib/indexTaxonomy'

export interface IndustryCluster {
  key: string
  industry: ClusterKey
  label: Record<IndexLocale, string>
}

export interface TechVertical {
  key: string
  cluster: string
  /** Anglais uniquement pour le moment — cf. note UI. */
  label: string
}

export const INDUSTRY_CLUSTERS: IndustryCluster[] = [
  { key: "banking_financial_services", industry: "finance_capital", label: { fr: "Banque & Services Financiers", en: "Banking & Financial Services", de: "Banken & Finanzdienstleistungen", es: "Banca y Servicios Financieros", it: "Banche & Servizi Finanziari", nl: "Banken & Financiële Diensten" } },
  { key: "fintech_payments", industry: "finance_capital", label: { fr: "FinTech & Paiements", en: "FinTech & Payments", de: "FinTech & Zahlungsverkehr", es: "FinTech y Pagos", it: "FinTech & Pagamenti", nl: "FinTech & Betalingen" } },
  { key: "proptech_real_estate", industry: "finance_capital", label: { fr: "PropTech & Immobilier", en: "PropTech & Real Estate", de: "PropTech & Immobilien", es: "PropTech e Inmobiliario", it: "PropTech & Immobiliare", nl: "PropTech & Vastgoed" } },
  { key: "health_pharmaceutical", industry: "sante_sciences", label: { fr: "Santé & Pharmaceutique", en: "Health & Pharmaceutical", de: "Gesundheit & Pharma", es: "Salud y Farmacéutica", it: "Salute & Farmaceutico", nl: "Gezondheid & Farmacie" } },
  { key: "healthtech_medtech", industry: "sante_sciences", label: { fr: "HealthTech & MedTech", en: "HealthTech & MedTech", de: "HealthTech & MedTech", es: "HealthTech y MedTech", it: "HealthTech & MedTech", nl: "HealthTech & MedTech" } },
  { key: "energy_utilities", industry: "industrie_infra", label: { fr: "Énergie & Utilities", en: "Energy & Utilities", de: "Energie & Versorger", es: "Energía y Utilities", it: "Energia & Utilities", nl: "Energie & Utilities" } },
  { key: "industry_manufacturing", industry: "industrie_infra", label: { fr: "Industrie & Manufacturing", en: "Industry & Manufacturing", de: "Industrie & Fertigung", es: "Industria y Manufactura", it: "Industria & Manifattura", nl: "Industrie & Productie" } },
  { key: "logistics_supply_chain", industry: "industrie_infra", label: { fr: "Logistique & Supply Chain", en: "Logistics & Supply Chain", de: "Logistik & Lieferkette", es: "Logística y Cadena de Suministro", it: "Logistica & Supply Chain", nl: "Logistiek & Supply Chain" } },
  { key: "construction_infrastructure", industry: "industrie_infra", label: { fr: "Construction & Infrastructure", en: "Construction & Infrastructure", de: "Bau & Infrastruktur", es: "Construcción e Infraestructura", it: "Costruzioni & Infrastrutture", nl: "Bouw & Infrastructuur" } },
  { key: "aerospace_defence", industry: "industrie_infra", label: { fr: "Aérospatiale & Défense", en: "Aerospace & Defence", de: "Luft- und Raumfahrt & Verteidigung", es: "Aeroespacial y Defensa", it: "Aerospazio & Difesa", nl: "Luchtvaart & Defensie" } },
  { key: "automotive_mobility", industry: "industrie_infra", label: { fr: "Automobile & Mobilité", en: "Automotive & Mobility", de: "Automobil & Mobilität", es: "Automoción y Movilidad", it: "Automotive & Mobilità", nl: "Automotive & Mobiliteit" } },
  { key: "agriculture_agrifood", industry: "industrie_infra", label: { fr: "Agriculture & Agroalimentaire", en: "Agriculture & Agri-food", de: "Landwirtschaft & Ernährung", es: "Agricultura y Agroalimentación", it: "Agricoltura & Agroalimentare", nl: "Landbouw & Voeding" } },
  { key: "chemicals_materials", industry: "industrie_infra", label: { fr: "Chimie & Matériaux Avancés", en: "Chemicals & Advanced Materials", de: "Chemie & Hochleistungsmaterialien", es: "Química y Materiales Avanzados", it: "Chimica & Materiali Avanzati", nl: "Chemie & Geavanceerde Materialen" } },
  { key: "transport_freight", industry: "industrie_infra", label: { fr: "Transport & Fret", en: "Transport & Freight", de: "Transport & Fracht", es: "Transporte y Carga", it: "Trasporti & Merci", nl: "Transport & Vracht" } },
  { key: "retail_ecommerce", industry: "commerce_services", label: { fr: "Retail & E-commerce", en: "Retail & E-commerce", de: "Retail & E-Commerce", es: "Retail y E-commerce", it: "Retail & E-commerce", nl: "Retail & E-commerce" } },
  { key: "hospitality_tourism", industry: "commerce_services", label: { fr: "Hôtellerie & Tourisme", en: "Hospitality & Tourism", de: "Hotellerie & Tourismus", es: "Hotelería y Turismo", it: "Hotellerie & Turismo", nl: "Horeca & Toerisme" } },
  { key: "luxury_premium_retail", industry: "commerce_services", label: { fr: "Luxe & Retail Premium", en: "Luxury & Premium Retail", de: "Luxus & Premium-Retail", es: "Lujo y Retail Premium", it: "Lusso & Retail Premium", nl: "Luxe & Premium Retail" } },
  { key: "media_entertainment", industry: "commerce_services", label: { fr: "Médias & Entertainment", en: "Media & Entertainment", de: "Medien & Entertainment", es: "Medios y Entretenimiento", it: "Media & Entertainment", nl: "Media & Entertainment" } },
  { key: "telecommunications", industry: "commerce_services", label: { fr: "Télécommunications", en: "Telecommunications", de: "Telekommunikation", es: "Telecomunicaciones", it: "Telecomunicazioni", nl: "Telecommunicatie" } },
  { key: "technology_saas", industry: "tech_innovation", label: { fr: "Technologie & SaaS", en: "Technology & SaaS", de: "Technologie & SaaS", es: "Tecnología y SaaS", it: "Tecnologia & SaaS", nl: "Technologie & SaaS" } },
  { key: "education_edtech", industry: "tech_innovation", label: { fr: "Éducation & EdTech", en: "Education & EdTech", de: "Bildung & EdTech", es: "Educación y EdTech", it: "Istruzione & EdTech", nl: "Onderwijs & EdTech" } },
  { key: "govtech_public_sector", industry: "tech_innovation", label: { fr: "GovTech & Secteur Public", en: "GovTech & Public Sector", de: "GovTech & öffentlicher Sektor", es: "GovTech y Sector Público", it: "GovTech & Settore Pubblico", nl: "GovTech & Publieke Sector" } },
]

export const TECH_VERTICALS: TechVertical[] = [
  /* banking_financial_services */
  { key: "banking_financial_services__core_banking_platforms", cluster: "banking_financial_services", label: "Core banking platforms" },
  { key: "banking_financial_services__banking_as_a_service", cluster: "banking_financial_services", label: "Banking-as-a-Service (BaaS)" },
  { key: "banking_financial_services__digital_only_banks", cluster: "banking_financial_services", label: "Digital-only banks (neobanks)" },
  { key: "banking_financial_services__credit_scoring_decisioning_ai", cluster: "banking_financial_services", label: "Credit scoring & decisioning AI" },
  { key: "banking_financial_services__trade_finance_technology", cluster: "banking_financial_services", label: "Trade finance technology" },
  { key: "banking_financial_services__wealth_investment_management_platforms", cluster: "banking_financial_services", label: "Wealth & investment management platforms" },
  { key: "banking_financial_services__open_banking_api_infrastructure", cluster: "banking_financial_services", label: "Open banking & API infrastructure" },
  { key: "banking_financial_services__aml_fraud_detection_technology", cluster: "banking_financial_services", label: "AML & fraud detection technology" },
  { key: "banking_financial_services__treasury_management_software", cluster: "banking_financial_services", label: "Treasury management software" },
  { key: "banking_financial_services__banking_regtech_compliance", cluster: "banking_financial_services", label: "Banking RegTech & compliance" },
  /* fintech_payments */
  { key: "fintech_payments__payment_processing_acquiring", cluster: "fintech_payments", label: "Payment processing & acquiring" },
  { key: "fintech_payments__digital_wallets_cards", cluster: "fintech_payments", label: "Digital wallets & cards" },
  { key: "fintech_payments__cross_border_payments", cluster: "fintech_payments", label: "Cross-border payments" },
  { key: "fintech_payments__buy_now_pay_later", cluster: "fintech_payments", label: "Buy Now Pay Later (BNPL)" },
  { key: "fintech_payments__crypto_stablecoin_infrastructure", cluster: "fintech_payments", label: "Crypto & stablecoin infrastructure" },
  { key: "fintech_payments__embedded_finance_payroll", cluster: "fintech_payments", label: "Embedded finance & payroll" },
  { key: "fintech_payments__point_of_sale_software", cluster: "fintech_payments", label: "Point-of-sale software" },
  { key: "fintech_payments__invoicing_accounts_receivable_automation", cluster: "fintech_payments", label: "Invoicing & accounts receivable automation" },
  { key: "fintech_payments__remittance_technology", cluster: "fintech_payments", label: "Remittance technology" },
  { key: "fintech_payments__fx_treasury_payment_platforms", cluster: "fintech_payments", label: "FX & treasury payment platforms" },
  /* proptech_real_estate */
  { key: "proptech_real_estate__property_management_software", cluster: "proptech_real_estate", label: "Property management software" },
  { key: "proptech_real_estate__real_estate_marketplaces", cluster: "proptech_real_estate", label: "Real estate marketplaces" },
  { key: "proptech_real_estate__tenant_credit_scoring_ai", cluster: "proptech_real_estate", label: "Tenant & credit scoring AI" },
  { key: "proptech_real_estate__construction_technology", cluster: "proptech_real_estate", label: "Construction technology (BIM, site digitisation)" },
  { key: "proptech_real_estate__flexible_workspace_coworking_tech", cluster: "proptech_real_estate", label: "Flexible workspace & coworking tech" },
  { key: "proptech_real_estate__smart_building_iot_platforms", cluster: "proptech_real_estate", label: "Smart building & IoT platforms" },
  { key: "proptech_real_estate__real_estate_tokenisation", cluster: "proptech_real_estate", label: "Real estate tokenisation" },
  { key: "proptech_real_estate__digital_brokerage_e_signature_for_real_e", cluster: "proptech_real_estate", label: "Digital brokerage & e-signature for real estate" },
  { key: "proptech_real_estate__real_estate_investment_platforms", cluster: "proptech_real_estate", label: "Real estate investment platforms" },
  { key: "proptech_real_estate__property_data_valuation_ai", cluster: "proptech_real_estate", label: "Property data & valuation AI" },
  /* health_pharmaceutical */
  { key: "health_pharmaceutical__pharma_r_d_software", cluster: "health_pharmaceutical", label: "Pharma R&D software" },
  { key: "health_pharmaceutical__clinical_trial_management_platforms", cluster: "health_pharmaceutical", label: "Clinical trial management platforms" },
  { key: "health_pharmaceutical__drug_discovery_ai", cluster: "health_pharmaceutical", label: "Drug discovery AI" },
  { key: "health_pharmaceutical__pharma_supply_chain_technology", cluster: "health_pharmaceutical", label: "Pharma supply chain technology" },
  { key: "health_pharmaceutical__pharmacovigilance_software", cluster: "health_pharmaceutical", label: "Pharmacovigilance software" },
  { key: "health_pharmaceutical__regulatory_compliance_technology", cluster: "health_pharmaceutical", label: "Regulatory compliance technology (pharma)" },
  { key: "health_pharmaceutical__digital_pharmacy_distribution_platforms", cluster: "health_pharmaceutical", label: "Digital pharmacy & distribution platforms" },
  { key: "health_pharmaceutical__manufacturing_execution_systems", cluster: "health_pharmaceutical", label: "Manufacturing execution systems (pharma)" },
  { key: "health_pharmaceutical__real_world_evidence_clinical_data_platfo", cluster: "health_pharmaceutical", label: "Real-world evidence & clinical data platforms" },
  { key: "health_pharmaceutical__clinical_data_interoperability_platforms", cluster: "health_pharmaceutical", label: "Clinical data interoperability platforms" },
  /* healthtech_medtech */
  { key: "healthtech_medtech__telemedicine_remote_consultation", cluster: "healthtech_medtech", label: "Telemedicine & remote consultation" },
  { key: "healthtech_medtech__electronic_health_records", cluster: "healthtech_medtech", label: "Electronic health records (EHR)" },
  { key: "healthtech_medtech__ai_diagnostics_medical_imaging", cluster: "healthtech_medtech", label: "AI diagnostics & medical imaging" },
  { key: "healthtech_medtech__connected_medical_devices", cluster: "healthtech_medtech", label: "Connected medical devices" },
  { key: "healthtech_medtech__practice_management_revenue_cycle_softwa", cluster: "healthtech_medtech", label: "Practice management & revenue cycle software" },
  { key: "healthtech_medtech__digital_mental_health_platforms", cluster: "healthtech_medtech", label: "Digital mental health platforms" },
  { key: "healthtech_medtech__health_fitness_wearables", cluster: "healthtech_medtech", label: "Health & fitness wearables" },
  { key: "healthtech_medtech__care_coordination_platforms", cluster: "healthtech_medtech", label: "Care coordination platforms" },
  { key: "healthtech_medtech__health_insurance_technology", cluster: "healthtech_medtech", label: "Health insurance technology (InsurTech)" },
  { key: "healthtech_medtech__remote_patient_monitoring", cluster: "healthtech_medtech", label: "Remote patient monitoring" },
  /* energy_utilities */
  { key: "energy_utilities__smart_grid_management", cluster: "energy_utilities", label: "Smart grid management" },
  { key: "energy_utilities__energy_trading_platforms", cluster: "energy_utilities", label: "Energy trading platforms" },
  { key: "energy_utilities__demand_response_derms", cluster: "energy_utilities", label: "Demand response & DERMS" },
  { key: "energy_utilities__solar_wind_monitoring_platforms", cluster: "energy_utilities", label: "Solar & wind monitoring platforms" },
  { key: "energy_utilities__home_building_energy_management", cluster: "energy_utilities", label: "Home & building energy management" },
  { key: "energy_utilities__utility_billing_software", cluster: "energy_utilities", label: "Utility billing software" },
  { key: "energy_utilities__battery_energy_storage_management", cluster: "energy_utilities", label: "Battery & energy storage management" },
  { key: "energy_utilities__carbon_accounting_esg_reporting", cluster: "energy_utilities", label: "Carbon accounting & ESG reporting" },
  { key: "energy_utilities__virtual_power_plant_platforms", cluster: "energy_utilities", label: "Virtual power plant platforms" },
  /* industry_manufacturing */
  { key: "industry_manufacturing__manufacturing_execution_systems", cluster: "industry_manufacturing", label: "Manufacturing execution systems (MES)" },
  { key: "industry_manufacturing__predictive_maintenance_ai", cluster: "industry_manufacturing", label: "Predictive maintenance AI" },
  { key: "industry_manufacturing__industrial_digital_twins", cluster: "industry_manufacturing", label: "Industrial digital twins" },
  { key: "industry_manufacturing__industrial_robotics_automation_software", cluster: "industry_manufacturing", label: "Industrial robotics & automation software" },
  { key: "industry_manufacturing__manufacturing_supply_chain_planning", cluster: "industry_manufacturing", label: "Manufacturing supply chain planning" },
  { key: "industry_manufacturing__quality_management_traceability_systems", cluster: "industry_manufacturing", label: "Quality management & traceability systems" },
  { key: "industry_manufacturing__industrial_iot", cluster: "industry_manufacturing", label: "Industrial IoT (IIoT) platforms" },
  { key: "industry_manufacturing__product_lifecycle_management", cluster: "industry_manufacturing", label: "Product lifecycle management (PLM)" },
  { key: "industry_manufacturing__factory_scheduling_production_planning", cluster: "industry_manufacturing", label: "Factory scheduling & production planning" },
  /* logistics_supply_chain */
  { key: "logistics_supply_chain__transport_management_systems", cluster: "logistics_supply_chain", label: "Transport management systems (TMS)" },
  { key: "logistics_supply_chain__warehouse_management_systems", cluster: "logistics_supply_chain", label: "Warehouse management systems (WMS)" },
  { key: "logistics_supply_chain__real_time_supply_chain_visibility_platfo", cluster: "logistics_supply_chain", label: "Real-time supply chain visibility platforms" },
  { key: "logistics_supply_chain__route_optimisation_last_mile_delivery", cluster: "logistics_supply_chain", label: "Route optimisation & last-mile delivery" },
  { key: "logistics_supply_chain__freight_marketplaces_digital_freight_for", cluster: "logistics_supply_chain", label: "Freight marketplaces & digital freight forwarding" },
  { key: "logistics_supply_chain__demand_forecasting_ai", cluster: "logistics_supply_chain", label: "Demand forecasting AI" },
  { key: "logistics_supply_chain__warehouse_robotics_automation", cluster: "logistics_supply_chain", label: "Warehouse robotics & automation" },
  { key: "logistics_supply_chain__supply_chain_risk_management_platforms", cluster: "logistics_supply_chain", label: "Supply chain risk management platforms" },
  { key: "logistics_supply_chain__inventory_optimisation_software", cluster: "logistics_supply_chain", label: "Inventory optimisation software" },
  /* construction_infrastructure */
  { key: "construction_infrastructure__building_information_modelling", cluster: "construction_infrastructure", label: "Building Information Modelling (BIM)" },
  { key: "construction_infrastructure__construction_site_management_software", cluster: "construction_infrastructure", label: "Construction site management software" },
  { key: "construction_infrastructure__construction_estimating_bidding_software", cluster: "construction_infrastructure", label: "Construction estimating & bidding software" },
  { key: "construction_infrastructure__site_safety_iot_monitoring", cluster: "construction_infrastructure", label: "Site safety & IoT monitoring" },
  { key: "construction_infrastructure__construction_permitting_compliance_techn", cluster: "construction_infrastructure", label: "Construction permitting & compliance technology" },
  { key: "construction_infrastructure__building_materials_marketplaces", cluster: "construction_infrastructure", label: "Building materials marketplaces" },
  { key: "construction_infrastructure__construction_project_management_platform", cluster: "construction_infrastructure", label: "Construction project management platforms" },
  { key: "construction_infrastructure__digital_twin_for_infrastructure", cluster: "construction_infrastructure", label: "Digital twin for infrastructure" },
  { key: "construction_infrastructure__construction_robotics_prefabrication_tec", cluster: "construction_infrastructure", label: "Construction robotics & prefabrication technology" },
  { key: "construction_infrastructure__facilities_management_software", cluster: "construction_infrastructure", label: "Facilities management software" },
  /* aerospace_defence */
  { key: "aerospace_defence__aerospace_simulation_digital_twin", cluster: "aerospace_defence", label: "Aerospace simulation & digital twin" },
  { key: "aerospace_defence__defence_cybersecurity_platforms", cluster: "aerospace_defence", label: "Defence cybersecurity platforms" },
  { key: "aerospace_defence__fleet_management_for_aviation", cluster: "aerospace_defence", label: "Fleet management for aviation" },
  { key: "aerospace_defence__mro", cluster: "aerospace_defence", label: "MRO (maintenance, repair & overhaul) software" },
  { key: "aerospace_defence__command_control_systems", cluster: "aerospace_defence", label: "Command & control systems" },
  { key: "aerospace_defence__satellite_space_data_platforms", cluster: "aerospace_defence", label: "Satellite & space data platforms" },
  { key: "aerospace_defence__defence_supply_chain_technology", cluster: "aerospace_defence", label: "Defence supply chain technology" },
  { key: "aerospace_defence__drone_uav_platforms", cluster: "aerospace_defence", label: "Drone & UAV platforms" },
  { key: "aerospace_defence__space_launch_satellite_operations_softwa", cluster: "aerospace_defence", label: "Space launch & satellite operations software" },
  /* automotive_mobility */
  { key: "automotive_mobility__mobility_as_a_service", cluster: "automotive_mobility", label: "Mobility-as-a-Service (MaaS) platforms" },
  { key: "automotive_mobility__connected_vehicle_software", cluster: "automotive_mobility", label: "Connected vehicle software" },
  { key: "automotive_mobility__fleet_management_telematics", cluster: "automotive_mobility", label: "Fleet management & telematics" },
  { key: "automotive_mobility__ev_charging_infrastructure_software", cluster: "automotive_mobility", label: "EV charging infrastructure software" },
  { key: "automotive_mobility__autonomous_driving_software", cluster: "automotive_mobility", label: "Autonomous driving software" },
  { key: "automotive_mobility__digital_used_vehicle_marketplaces", cluster: "automotive_mobility", label: "Digital used-vehicle marketplaces" },
  { key: "automotive_mobility__vehicle_subscription_leasing_platforms", cluster: "automotive_mobility", label: "Vehicle subscription & leasing platforms" },
  { key: "automotive_mobility__automotive_aftermarket_service_platforms", cluster: "automotive_mobility", label: "Automotive aftermarket & service platforms" },
  { key: "automotive_mobility__micromobility_shared_mobility_platforms", cluster: "automotive_mobility", label: "Micromobility & shared mobility platforms" },
  /* agriculture_agrifood */
  { key: "agriculture_agrifood__farm_management_software", cluster: "agriculture_agrifood", label: "Farm management software" },
  { key: "agriculture_agrifood__precision_agriculture", cluster: "agriculture_agrifood", label: "Precision agriculture (sensors, drones, imaging)" },
  { key: "agriculture_agrifood__food_traceability_blockchain_platforms", cluster: "agriculture_agrifood", label: "Food traceability & blockchain platforms" },
  { key: "agriculture_agrifood__b2b_agricultural_marketplaces", cluster: "agriculture_agrifood", label: "B2B agricultural marketplaces" },
  { key: "agriculture_agrifood__foodtech_alternative_protein_technology", cluster: "agriculture_agrifood", label: "FoodTech & alternative protein technology" },
  { key: "agriculture_agrifood__cold_chain_management_technology", cluster: "agriculture_agrifood", label: "Cold chain management technology" },
  { key: "agriculture_agrifood__agtech_data_analytics_platforms", cluster: "agriculture_agrifood", label: "AgTech data & analytics platforms" },
  { key: "agriculture_agrifood__vertical_farming_technology", cluster: "agriculture_agrifood", label: "Vertical farming technology" },
  { key: "agriculture_agrifood__agri_biotech_platforms", cluster: "agriculture_agrifood", label: "Agri-biotech platforms" },
  { key: "agriculture_agrifood__livestock_management_technology", cluster: "agriculture_agrifood", label: "Livestock management technology" },
  /* chemicals_materials */
  { key: "chemicals_materials__molecular_materials_simulation_ai", cluster: "chemicals_materials", label: "Molecular & materials simulation AI" },
  { key: "chemicals_materials__hse", cluster: "chemicals_materials", label: "HSE (health, safety, environment) management software" },
  { key: "chemicals_materials__chemical_compliance_traceability_platfor", cluster: "chemicals_materials", label: "Chemical compliance & traceability platforms (REACH)" },
  { key: "chemicals_materials__circular_economy_recycling_technology", cluster: "chemicals_materials", label: "Circular economy & recycling technology" },
  { key: "chemicals_materials__chemical_supply_chain_platforms", cluster: "chemicals_materials", label: "Chemical supply chain platforms" },
  { key: "chemicals_materials__advanced_materials_data_platforms", cluster: "chemicals_materials", label: "Advanced materials data platforms" },
  { key: "chemicals_materials__battery_materials_technology", cluster: "chemicals_materials", label: "Battery materials technology" },
  { key: "chemicals_materials__specialty_chemicals_formulation_software", cluster: "chemicals_materials", label: "Specialty chemicals formulation software" },
  { key: "chemicals_materials__sustainable_packaging_technology", cluster: "chemicals_materials", label: "Sustainable packaging technology" },
  /* transport_freight */
  { key: "transport_freight__freight_matching_marketplaces", cluster: "transport_freight", label: "Freight matching marketplaces" },
  { key: "transport_freight__real_time_freight_tracking_technology", cluster: "transport_freight", label: "Real-time freight tracking technology" },
  { key: "transport_freight__customs_trade_documentation_platforms", cluster: "transport_freight", label: "Customs & trade documentation platforms" },
  { key: "transport_freight__multimodal_transport_optimisation", cluster: "transport_freight", label: "Multimodal transport optimisation" },
  { key: "transport_freight__rail_maritime_logistics_software", cluster: "transport_freight", label: "Rail & maritime logistics software" },
  { key: "transport_freight__fleet_fuel_carbon_management", cluster: "transport_freight", label: "Fleet fuel & carbon management" },
  { key: "transport_freight__cross_border_trade_compliance_technology", cluster: "transport_freight", label: "Cross-border trade compliance technology" },
  { key: "transport_freight__port_terminal_management_software", cluster: "transport_freight", label: "Port & terminal management software" },
  { key: "transport_freight__fleet_leasing_asset_management_platforms", cluster: "transport_freight", label: "Fleet leasing & asset management platforms" },
  /* retail_ecommerce */
  { key: "retail_ecommerce__headless_e_commerce_platforms", cluster: "retail_ecommerce", label: "Headless e-commerce platforms" },
  { key: "retail_ecommerce__omnichannel_inventory_management", cluster: "retail_ecommerce", label: "Omnichannel inventory management (OMS)" },
  { key: "retail_ecommerce__ai_personalisation_recommendation_engine", cluster: "retail_ecommerce", label: "AI personalisation & recommendation engines" },
  { key: "retail_ecommerce__retail_media_advertising_platforms", cluster: "retail_ecommerce", label: "Retail media & advertising platforms" },
  { key: "retail_ecommerce__social_commerce_platforms", cluster: "retail_ecommerce", label: "Social commerce platforms" },
  { key: "retail_ecommerce__b2b2c_marketplaces", cluster: "retail_ecommerce", label: "B2B2C marketplaces" },
  { key: "retail_ecommerce__next_generation_point_of_sale", cluster: "retail_ecommerce", label: "Next-generation point-of-sale (POS)" },
  { key: "retail_ecommerce__reverse_logistics_returns_management", cluster: "retail_ecommerce", label: "Reverse logistics & returns management" },
  { key: "retail_ecommerce__loyalty_customer_retention_platforms", cluster: "retail_ecommerce", label: "Loyalty & customer retention platforms" },
  { key: "retail_ecommerce__retail_analytics_demand_planning", cluster: "retail_ecommerce", label: "Retail analytics & demand planning" },
  /* hospitality_tourism */
  { key: "hospitality_tourism__hotel_channel_management_distribution", cluster: "hospitality_tourism", label: "Hotel channel management & distribution" },
  { key: "hospitality_tourism__property_management_systems", cluster: "hospitality_tourism", label: "Property management systems (PMS) for hospitality" },
  { key: "hospitality_tourism__booking_platforms_online_travel_agencies", cluster: "hospitality_tourism", label: "Booking platforms & online travel agencies" },
  { key: "hospitality_tourism__guest_experience_digital_concierge_platf", cluster: "hospitality_tourism", label: "Guest experience & digital concierge platforms" },
  { key: "hospitality_tourism__revenue_management_ai_for_hospitality", cluster: "hospitality_tourism", label: "Revenue management AI for hospitality" },
  { key: "hospitality_tourism__restaurant_f_b_management_technology", cluster: "hospitality_tourism", label: "Restaurant & F&B management technology" },
  { key: "hospitality_tourism__tour_activity_booking_platforms", cluster: "hospitality_tourism", label: "Tour & activity booking platforms" },
  /* luxury_premium_retail */
  { key: "luxury_premium_retail__digital_authentication_anti_counterfeiti", cluster: "luxury_premium_retail", label: "Digital authentication & anti-counterfeiting technology" },
  { key: "luxury_premium_retail__clienteling_luxury_crm_platforms", cluster: "luxury_premium_retail", label: "Clienteling & luxury CRM platforms" },
  { key: "luxury_premium_retail__omnichannel_luxury_experience_platforms", cluster: "luxury_premium_retail", label: "Omnichannel luxury experience platforms" },
  { key: "luxury_premium_retail__luxury_supply_chain_traceability", cluster: "luxury_premium_retail", label: "Luxury supply chain traceability" },
  { key: "luxury_premium_retail__resale_circular_luxury_marketplaces", cluster: "luxury_premium_retail", label: "Resale & circular luxury marketplaces" },
  { key: "luxury_premium_retail__personal_shopping_styling_platforms", cluster: "luxury_premium_retail", label: "Personal shopping & styling platforms" },
  { key: "luxury_premium_retail__luxury_e_commerce_platforms", cluster: "luxury_premium_retail", label: "Luxury e-commerce platforms" },
  { key: "luxury_premium_retail__auction_collectibles_marketplaces", cluster: "luxury_premium_retail", label: "Auction & collectibles marketplaces" },
  /* media_entertainment */
  { key: "media_entertainment__streaming_content_platforms", cluster: "media_entertainment", label: "Streaming & content platforms" },
  { key: "media_entertainment__adtech_advertising_monetisation", cluster: "media_entertainment", label: "AdTech & advertising monetisation" },
  { key: "media_entertainment__rights_royalties_management_platforms", cluster: "media_entertainment", label: "Rights & royalties management platforms" },
  { key: "media_entertainment__ai_assisted_content_creation_tools", cluster: "media_entertainment", label: "AI-assisted content creation tools" },
  { key: "media_entertainment__gaming_platforms_infrastructure", cluster: "media_entertainment", label: "Gaming platforms & infrastructure" },
  { key: "media_entertainment__creator_economy_platforms", cluster: "media_entertainment", label: "Creator economy platforms" },
  { key: "media_entertainment__content_licensing_marketplaces", cluster: "media_entertainment", label: "Content licensing marketplaces" },
  { key: "media_entertainment__live_events_ticketing_technology", cluster: "media_entertainment", label: "Live events & ticketing technology" },
  /* telecommunications */
  { key: "telecommunications__network_virtualisation", cluster: "telecommunications", label: "Network virtualisation (NFV/SDN)" },
  { key: "telecommunications__telecom_billing_bss_oss_platforms", cluster: "telecommunications", label: "Telecom billing & BSS/OSS platforms" },
  { key: "telecommunications__telecom_customer_experience_management", cluster: "telecommunications", label: "Telecom customer experience management" },
  { key: "telecommunications__iot_connectivity_platforms", cluster: "telecommunications", label: "IoT connectivity platforms" },
  { key: "telecommunications__network_monitoring_optimisation_software", cluster: "telecommunications", label: "Network monitoring & optimisation software" },
  { key: "telecommunications__5g_infrastructure_software", cluster: "telecommunications", label: "5G infrastructure software" },
  { key: "telecommunications__satellite_communications_platforms", cluster: "telecommunications", label: "Satellite communications platforms" },
  { key: "telecommunications__unified_communications_collaboration_sof", cluster: "telecommunications", label: "Unified communications & collaboration software" },
  /* technology_saas */
  { key: "technology_saas__vertical_saas", cluster: "technology_saas", label: "Vertical SaaS" },
  { key: "technology_saas__horizontal_saas", cluster: "technology_saas", label: "Horizontal SaaS" },
  { key: "technology_saas__ai_native_vertical_ai_applications", cluster: "technology_saas", label: "AI-native & vertical AI applications" },
  { key: "technology_saas__marketplaces_platforms", cluster: "technology_saas", label: "Marketplaces & platforms" },
  { key: "technology_saas__mobile_consumer_applications", cluster: "technology_saas", label: "Mobile & consumer applications" },
  { key: "technology_saas__developer_tools_infrastructure", cluster: "technology_saas", label: "Developer tools & infrastructure" },
  { key: "technology_saas__cybersecurity", cluster: "technology_saas", label: "Cybersecurity" },
  { key: "technology_saas__data_analytics", cluster: "technology_saas", label: "Data & analytics" },
  { key: "technology_saas__web3_digital_assets", cluster: "technology_saas", label: "Web3 & digital assets" },
  { key: "technology_saas__adtech_martech", cluster: "technology_saas", label: "AdTech & MarTech" },
  { key: "technology_saas__devops_cloud_infrastructure", cluster: "technology_saas", label: "DevOps & cloud infrastructure" },
  { key: "technology_saas__api_management_integration_platforms", cluster: "technology_saas", label: "API management & integration platforms" },
  /* education_edtech */
  { key: "education_edtech__learning_management_systems", cluster: "education_edtech", label: "Learning management systems (LMS)" },
  { key: "education_edtech__corporate_professional_training_platform", cluster: "education_edtech", label: "Corporate & professional training platforms" },
  { key: "education_edtech__k_12_edtech_platforms", cluster: "education_edtech", label: "K-12 EdTech platforms" },
  { key: "education_edtech__digital_assessment_certification_platfor", cluster: "education_edtech", label: "Digital assessment & certification platforms" },
  { key: "education_edtech__higher_education_technology", cluster: "education_edtech", label: "Higher education technology" },
  { key: "education_edtech__language_learning_platforms", cluster: "education_edtech", label: "Language learning platforms" },
  { key: "education_edtech__skills_workforce_development_platforms", cluster: "education_edtech", label: "Skills & workforce development platforms" },
  { key: "education_edtech__tutoring_test_prep_platforms", cluster: "education_edtech", label: "Tutoring & test-prep platforms" },
  { key: "education_edtech__academic_research_publishing_technology", cluster: "education_edtech", label: "Academic research & publishing technology" },
  /* govtech_public_sector */
  { key: "govtech_public_sector__digital_government_services", cluster: "govtech_public_sector", label: "Digital government services (e-government)" },
  { key: "govtech_public_sector__sovereign_digital_identity_platforms", cluster: "govtech_public_sector", label: "Sovereign digital identity platforms" },
  { key: "govtech_public_sector__public_health_technology", cluster: "govtech_public_sector", label: "Public health technology" },
  { key: "govtech_public_sector__public_safety_surveillance_technology", cluster: "govtech_public_sector", label: "Public safety & surveillance technology" },
  { key: "govtech_public_sector__smart_city_platforms", cluster: "govtech_public_sector", label: "Smart city platforms" },
  { key: "govtech_public_sector__civic_engagement_platforms", cluster: "govtech_public_sector", label: "Civic engagement platforms" },
  { key: "govtech_public_sector__public_procurement_technology", cluster: "govtech_public_sector", label: "Public procurement technology" },
  { key: "govtech_public_sector__tax_revenue_collection_technology", cluster: "govtech_public_sector", label: "Tax & revenue collection technology" },
  { key: "govtech_public_sector__digital_courts_legal_tech_for_government", cluster: "govtech_public_sector", label: "Digital courts & legal-tech for government" },
]

/** Clusters (22) regroupes par industrie (5), dans l'ordre officiel /industries. */
export function clustersByIndustry(industry: ClusterKey): IndustryCluster[] {
  return INDUSTRY_CLUSTERS.filter(c => c.industry === industry)
}

/** Verticaux (200+) d'un cluster donne. */
export function verticalsByCluster(clusterKey: string): TechVertical[] {
  return TECH_VERTICALS.filter(v => v.cluster === clusterKey)
}

