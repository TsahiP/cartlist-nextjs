export interface Root {
    results: Result[]
    pagination: Pagination
    facets: Facet[]
  }
  
  export interface Result {
    code: string
    name: string
    url: string
    description: string
    purchasable: any
    stock: Stock
    futureStocks: any
    availableForPickup: boolean
    averageRating: any
    numberOfReviews: number
    summary?: string
    manufacturer?: string
    variantType: any
    price: Price
    baseProduct: string
    images: Image[]
    categories: any
    reviews: any
    classifications: any
    potentialPromotions: any
    variantOptions: any
    baseOptions: any
    volumePricesFlag: boolean
    volumePrices: any
    productReferences: any
    variantMatrix: any
    priceRange: PriceRange
    firstCategoryNameList: any
    multidimensional: any
    configurable: any
    keywords: any
    genders: any
    sku: string
    commercialDepartment: any
    brand: Brand
    brandName: string
    deliveryItem: any
    associatedDeiveryItem: any
    inventoryManagement: any
    sellingMethod: SellingMethod
    groupingCode: any
    country: any
    manufacturerInfo: any
    privateLabel: boolean
    newProduct: boolean
    showOnSite: any
    showOnMobile: any
    searchable: any
    indexable: any
    packagingType: any
    sourceOfSupply: string
    productType: any
    adultsOnly: boolean
    giftProduct: any
    productSet: any
    minOrderWeight: any
    maxOrderWeight: number
    minOrderQuantity?: number
    maxOrderQuantity: number
    food: boolean
    ignoreERPCategory: any
    stockReservationMethod: any
    ean: any
    popularityRanking: any
    pricePerUnit: PricePerUnit
    categoryPrice: CategoryPrice
    pricePerUnitWithoutDiscount: any
    valueForComparison: number
    unitForComparison: string
    unitDescription: string
    depositPrice: any
    gallery360Images: any
    gallery360Link: any
    galleryAudios: any
    galleryPdfs: any
    galleryVideos: any
    generalVideos: any
    links: any
    icon: Icon
    numberContentUnits: any
    unit: any
    deliveryTime: any
    commercialCategoryGroup: any
    commercialCategorySubGroup: any
    promotions: any
    productPriceGroup: any
    secondLevelCategory: string
    cartStatus: CartStatus
    promotionsDisplay: any
    promotionMsg: any
    promotionCharacteristicsImg: any
    promotionCodes: any[]
    mainPromotionCode: any
    promotionCount: any
    promotionCharacteristicDescription: any
    allCategoryCodes: string[]
    effectiveMinQuantity: any
    effectivePrice: any
    effectivePricePerUnit: any
    remarks: any
    weightConversion: any
    baseProductImageLarge: string
    baseProductImageMedium: string
    baseProductImageSmall: string
    baseProductDescription: string
    coordinationType: any
    canonical: any
    supply: any
    responsibility: any
    noIndex: any
    longTail: boolean
    isBeProduct: any
    leafletLink: any
    modifiable: any
    calories?: number
    fats?: number
    healthy: any
    sodium: any
    sugar: any
    weightIncrement: number
    maxWeight?: number
    minWeight?: number
    healthAttributes: HealthAttribute[]
    healthRecommendation: any
  }
  
  export interface Stock {
    stockLevelStatus: StockLevelStatus
    stockLevel: any
    stockThreshold: any
    available: any
    reserved: any
    invMethod: any
    inventoryManagement: any
    inventoryOnTheWay: any
    minimalThreshold1: any
    minimalThreshold2: any
    warehouse: any
    productCode: any
  }
  
  export interface StockLevelStatus {
    code: string
    type: string
  }
  
  export interface Price {
    currencyIso: string
    value: number
    priceType: string
    formattedValue: string
    minQuantity: any
    maxQuantity: any
  }
  
  export interface Image {
    imageType: string
    format: string
    url: string
    altText?: string
    galleryIndex?: number
    width: any
    code: any
    color: any
    textColor: any
    rank: any
  }
  
  export interface PriceRange {
    minPrice: any
    maxPrice: any
  }
  
  export interface Brand {
    code: any
    name: string
  }
  
  export interface SellingMethod {
    code: string
    type: string
  }
  
  export interface PricePerUnit {
    currencyIso: string
    value: number
    priceType: string
    formattedValue: string
    minQuantity: any
    maxQuantity: any
  }
  
  export interface CategoryPrice {
    currencyIso: string
    value: number
    priceType: string
    formattedValue: string
    minQuantity: any
    maxQuantity: any
  }
  
  export interface Icon {
    imageType: any
    format: any
    url?: string
    altText?: string
    galleryIndex: any
    width: any
    code: any
    color: any
    textColor: any
    rank: any
  }
  
  export interface CartStatus {
    inCart: boolean
    qty: any
    sellingMethod: any
    comment: any
    cartEntryNumber: any
  }
  
  export interface HealthAttribute {
    code: string
    type: string
  }
  
  export interface Pagination {
    pageSize: number
    currentPage: number
    sort: string
    numberOfPages: number
    totalNumberOfResults: number
  }
  
  export interface Facet {
    code: string
    name: string
    priority: number
    category: boolean
    multiSelect: boolean
    visible: boolean
    topValues: any
    values: Value[]
  }
  
  export interface Value {
    code: string
    name: string
    count: number
    query: Query
    selected: boolean
  }
  
  export interface Query {
    url: string
    query: Query2
  }
  
  export interface Query2 {
    value: string
  }
  