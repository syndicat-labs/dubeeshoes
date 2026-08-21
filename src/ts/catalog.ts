/**
 * Catalog Module — Product grid rendering and filtering with inline expansion
 */

import { Products, ProductCategories, getProductById, getProductsByCategory, formatPrice, getRecentlyViewed, addToRecentlyViewed, type Product } from './products';

class CatalogPage {
  private currentCategory: string = 'all';
  private expandedProductId: string | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupFilters();
    this.renderProducts();
    this.renderRecentlyViewed();
    this.setupHeaderScroll();
    this.checkUrlParams();
    this.setupExpandedView();
  }

  private checkUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const productId = params.get('product');
    
    if (category && ProductCategories.some(c => c.id === category)) {
      this.currentCategory = category;
      this.updateFilterUI();
      this.renderProducts();
    }
    
    if (productId) {
      this.expandProduct(productId);
    }
  }

  private setupFilters(): void {
    const categoryFilters = document.getElementById('categoryFilters');
    if (categoryFilters) {
      categoryFilters.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('catalog-filter-btn')) {
          const category = target.dataset.category;
          if (category) {
            this.currentCategory = category;
            this.updateFilterUI();
            this.renderProducts();
          }
        }
      });
    }
  }

  private updateFilterUI(): void {
    const categoryFilters = document.getElementById('categoryFilters');
    if (categoryFilters) {
      categoryFilters.querySelectorAll('.catalog-filter-btn').forEach(btn => {
        const element = btn as HTMLElement;
        element.classList.remove('active');
        if (element.dataset.category === this.currentCategory) {
          element.classList.add('active');
        }
      });
    }
  }

  private getFilteredProducts(): typeof Products {
    return getProductsByCategory(this.currentCategory);
  }

  private renderProducts(): void {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const products = this.getFilteredProducts();
    
    grid.innerHTML = products.map(product => `
      <article class="product-card ${this.expandedProductId === product.id ? 'product-card-expanded' : ''}" data-product-id="${product.id}">
        <div class="product-card-image">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<span class="product-card-badge badge badge-gold">${product.badge}</span>` : ''}
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${product.category}</span>
          <h3 class="product-card-name">${product.name}</h3>
          <span class="product-card-price">${formatPrice(product.price, product.currency)}</span>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const productId = (card as HTMLElement).dataset.productId;
        if (productId) {
          this.expandProduct(productId);
        }
      });
    });
  }

  private renderRecentlyViewed(): void {
    const recentIds = getRecentlyViewed();
    const section = document.getElementById('recentSection');
    const grid = document.getElementById('recentGrid');
    
    if (!section || !grid || recentIds.length === 0) return;

    const recentProducts = recentIds
      .map((id: string) => getProductById(id))
      .filter((p): p is Product => p !== undefined)
      .slice(0, 3);

    if (recentProducts.length === 0) return;

    section.style.display = 'block';
    
    grid.innerHTML = recentProducts.map((product: Product) => `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-card-image">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${product.category}</span>
          <h3 class="product-card-name">${product.name}</h3>
          <span class="product-card-price">${formatPrice(product.price, product.currency)}</span>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const productId = (card as HTMLElement).dataset.productId;
        if (productId) {
          this.expandProduct(productId);
        }
      });
    });
  }

  private setupExpandedView(): void {
    const closeBtn = document.getElementById('productExpandedClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.collapseProduct());
    }

    const expandedSection = document.getElementById('productExpanded');
    if (expandedSection) {
      expandedSection.addEventListener('click', (e) => {
        if (e.target === expandedSection) {
          this.collapseProduct();
        }
      });
    }

    const detailsToggle = document.getElementById('detailsToggle');
    const detailsContent = document.getElementById('detailsContent');
    if (detailsToggle && detailsContent) {
      detailsToggle.addEventListener('click', () => {
        detailsContent.classList.toggle('expanded');
        detailsToggle.classList.toggle('expanded');
      });
    }
  }

  private expandProduct(productId: string): void {
    const product = getProductById(productId);
    if (!product) return;

    this.expandedProductId = productId;
    
    const section = document.getElementById('productExpanded');
    const mainImage = document.getElementById('expandedMainImage') as HTMLImageElement;
    const thumbnails = document.getElementById('expandedThumbnails');
    const category = document.getElementById('expandedCategory');
    const name = document.getElementById('expandedName');
    const price = document.getElementById('expandedPrice');
    const description = document.getElementById('expandedDescription');
    const colors = document.getElementById('expandedColors');
    const sizes = document.getElementById('expandedSizes');
    const details = document.getElementById('expandedDetails');
    const material = document.getElementById('expandedMaterial');
    const construction = document.getElementById('expandedConstruction');
    const origin = document.getElementById('expandedOrigin');

    if (!section || !mainImage || !thumbnails || !category || !name || !price || !description || !colors || !sizes || !details || !material || !construction || !origin) return;

    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    thumbnails.innerHTML = product.images.map((img, i) => `
      <button class="product-expanded-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
        <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy">
      </button>
    `).join('');

    thumbnails.querySelectorAll('.product-expanded-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt((thumb as HTMLElement).dataset.index || '0');
        mainImage.src = product.images[index];
        thumbnails.querySelectorAll('.product-expanded-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    category.textContent = product.category;
    name.textContent = product.name;
    price.innerHTML = `<span class="price-currency">${product.currency}</span>${product.price.toLocaleString()}`;
    description.textContent = product.description;

    colors.innerHTML = product.colors.map((color, i) => `
      <button class="color-swatch ${i === 0 ? 'active' : ''}" 
        style="background-color: ${color.hex}"
        data-color="${color.name}"
        aria-label="${color.name}"
        title="${color.name}">
      </button>
    `).join('');

    colors.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        colors.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });
    });

    sizes.innerHTML = product.sizes.map((size, i) => `
      <button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${size}">${size}</button>
    `).join('');

    sizes.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sizes.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    details.innerHTML = product.details.map(detail => `<li>${detail}</li>`).join('');
    
    material.textContent = product.material;
    construction.textContent = product.construction;
    origin.textContent = product.origin;

    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    addToRecentlyViewed(productId);
    this.renderProducts();
  }

  private collapseProduct(): void {
    const section = document.getElementById('productExpanded');
    if (section) {
      section.style.display = 'none';
    }
    this.expandedProductId = null;
    this.renderProducts();
  }

  private setupHeaderScroll(): void {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = (): void => {
      if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CatalogPage();
});
