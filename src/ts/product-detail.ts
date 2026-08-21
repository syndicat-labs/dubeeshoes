/**
 * Product Detail Module — Single product view
 */

import { getProductById, getRecommendedProducts, formatPrice, getRecentlyViewed, addToRecentlyViewed } from './products';

class ProductDetailPage {
  private product: any = null;
  private selectedColor: string = '';

  constructor() {
    this.init();
  }

  private init(): void {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    if (!productId) {
      window.location.href = '/catalog.html';
      return;
    }

    this.product = getProductById(productId);
    
    if (!this.product) {
      window.location.href = '/catalog.html';
      return;
    }

    addToRecentlyViewed(productId);
    this.render();
    this.setupEventListeners();
    this.setupHeaderScroll();
  }

  private render(): void {
    document.title = `${this.product.name} — DubeeShoes`;
    
    const breadcrumb = document.getElementById('breadcrumbProduct');
    if (breadcrumb) breadcrumb.textContent = this.product.name;

    this.renderGallery();
    this.renderColors();
    this.renderSizes();
    this.renderDetails();
    this.renderMeta();
    this.renderRecommendations();
    this.renderRecentlyViewed();
  }

  private renderGallery(): void {
    const mainImage = document.getElementById('galleryMainImage') as HTMLImageElement;
    if (mainImage) {
      mainImage.src = this.product.images[0];
      mainImage.alt = this.product.name;
    }

    const thumbs = document.getElementById('galleryThumbs');
    if (thumbs) {
      thumbs.innerHTML = this.product.images.map((img: string, i: number) => `
        <button class="product-gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${img}" alt="${this.product.name} view ${i + 1}" loading="lazy">
        </button>
      `).join('');
    }
  }

  private renderColors(): void {
    const container = document.getElementById('colorOptions');
    if (!container) return;

    this.selectedColor = this.product.colors[0].name;
    
    container.innerHTML = this.product.colors.map((color: any, i: number) => `
      <button 
        class="color-swatch ${i === 0 ? 'active' : ''}" 
        style="background-color: ${color.hex}"
        data-color="${color.name}"
        aria-label="${color.name}"
        title="${color.name}"
      ></button>
    `).join('');

    this.updateColorLabel();
  }

  private renderSizes(): void {
    const container = document.getElementById('sizeOptions');
    if (!container) return;

    container.innerHTML = this.product.sizes.map((size: number) => `
      <button class="size-btn" data-size="${size}">${size}</button>
    `).join('');
  }

  private renderDetails(): void {
    const name = document.getElementById('productName');
    const category = document.getElementById('productCategory');
    const price = document.getElementById('productPrice');
    const description = document.getElementById('productDescription');
    const detailsList = document.getElementById('productDetails');

    if (name) name.textContent = this.product.name;
    if (category) category.textContent = this.product.category;
    if (price) price.textContent = formatPrice(this.product.price, this.product.currency);
    if (description) description.textContent = this.product.description;
    
    if (detailsList) {
      detailsList.innerHTML = this.product.details.map((detail: string) => `
        <li>${detail}</li>
      `).join('');
    }
  }

  private renderMeta(): void {
    const material = document.getElementById('productMaterial');
    const construction = document.getElementById('productConstruction');
    const origin = document.getElementById('productOrigin');

    if (material) material.textContent = this.product.material;
    if (construction) construction.textContent = this.product.construction;
    if (origin) origin.textContent = this.product.origin;
  }

  private renderRecommendations(): void {
    const section = document.getElementById('recommendationsSection');
    const grid = document.getElementById('recommendationsGrid');
    
    if (!section || !grid) return;

    const recommendations = getRecommendedProducts(this.product.id);
    if (recommendations.length === 0) return;

    section.style.display = 'block';
    
    grid.innerHTML = recommendations.map((product: any) => `
      <a href="/product.html?id=${product.id}" class="product-card-link">
        <article class="product-card">
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
      </a>
    `).join('');
  }

  private renderRecentlyViewed(): void {
    const recentIds = getRecentlyViewed();
    const section = document.getElementById('recentSection');
    const grid = document.getElementById('recentGrid');
    
    if (!section || !grid) return;

    const recentProducts = recentIds
      .filter((id: string) => id !== this.product.id)
      .map((id: string) => getProductById(id))
      .filter(Boolean)
      .slice(0, 3);

    if (recentProducts.length === 0) return;

    section.style.display = 'block';
    
    grid.innerHTML = recentProducts.map((product: any) => `
      <a href="/product.html?id=${product.id}" class="product-card-link">
        <article class="product-card">
          <div class="product-card-image">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-card-body">
            <span class="product-card-category">${product.category}</span>
            <h3 class="product-card-name">${product.name}</h3>
            <span class="product-card-price">${formatPrice(product.price, product.currency)}</span>
          </div>
        </article>
      </a>
    `).join('');
  }

  private setupEventListeners(): void {
    // Gallery thumbnails
    const thumbs = document.getElementById('galleryThumbs');
    if (thumbs) {
      thumbs.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const thumb = target.closest('.product-gallery-thumb') as HTMLElement;
        if (thumb) {
          const index = parseInt(thumb.dataset.index || '0');
          this.setActiveImage(index);
        }
      });
    }

    // Color selection
    const colorOptions = document.getElementById('colorOptions');
    if (colorOptions) {
      colorOptions.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('color-swatch')) {
          colorOptions.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('active');
          });
          target.classList.add('active');
          this.selectedColor = target.dataset.color || '';
          this.updateColorLabel();
        }
      });
    }

    // Size selection
    const sizeOptions = document.getElementById('sizeOptions');
    if (sizeOptions) {
      sizeOptions.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('size-btn')) {
          sizeOptions.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          target.classList.add('active');
        }
      });
    }

    // Details accordion
    const detailsToggle = document.getElementById('detailsToggle');
    const detailsContent = document.getElementById('detailsContent');
    if (detailsToggle && detailsContent) {
      detailsToggle.addEventListener('click', () => {
        detailsToggle.classList.toggle('open');
        detailsContent.classList.toggle('open');
      });
    }

    // Add to wishlist
    const addToWishlist = document.getElementById('addToWishlist');
    if (addToWishlist) {
      addToWishlist.addEventListener('click', () => {
        this.showWishlistSuccess();
      });
    }
  }

  private setActiveImage(index: number): void {
    const mainImage = document.getElementById('galleryMainImage') as HTMLImageElement;
    if (mainImage) {
      mainImage.src = this.product.images[index];
    }

    const thumbs = document.querySelectorAll('.product-gallery-thumb');
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  private updateColorLabel(): void {
    const label = document.getElementById('selectedColor');
    if (label) {
      label.textContent = this.selectedColor;
    }
  }

  private showWishlistSuccess(): void {
    const btn = document.getElementById('addToWishlist');
    if (!btn) return;

    const originalText = btn.textContent;
    btn.textContent = 'Added to Wishlist';
    btn.classList.add('btn-secondary');
    btn.classList.remove('btn-primary');
    btn.setAttribute('disabled', 'true');

    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      btn.removeAttribute('disabled');
    }, 2000);
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
  new ProductDetailPage();
});
