import React, { useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import { initialProducts } from "./data/initialProducts";
import { productService } from "./services/productService";
import useLocalStorage from "./hooks/useLocalStorage";
import AppNavbar from "./components/AppNavbar";
import ProductStats from "./components/ProductStats";
import ProductFilter from "./components/ProductFilter";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import DeleteModal from "./components/DeleteModal";
import AppFooter from "./components/AppFooter";

function App() {
  const [products, setProducts] = useLocalStorage("sba301_slot6_products", initialProducts);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Business logic via productService
  const categories = useMemo(() => productService.getCategories(products), [products]);
  const stats = useMemo(() => productService.calculateStats(products), [products]);

  const filteredProducts = useMemo(() => {
    return productService.filterProducts(products, {
      searchKeyword,
      selectedCategory,
      sortBy
    });
  }, [products, searchKeyword, selectedCategory, sortBy]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setShowFormModal(true);
  };

  const handleSaveProduct = (formData) => {
    if (editingProduct) {
      const updated = productService.updateProduct(products, editingProduct.id, formData);
      setProducts(updated);
    } else {
      const added = productService.createProduct(products, formData);
      setProducts(added);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingProduct) {
      const updated = productService.deleteProduct(products, deletingProduct.id);
      setProducts(updated);
      setDeletingProduct(null);
    }
  };

  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedCategory("All");
    setSortBy("name");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar onOpenAddModal={handleOpenAdd} />
      <Container className="py-4 flex-grow-1">
        <ProductStats stats={stats} />
        <ProductFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
        />
        <ProductList
          products={filteredProducts}
          onEdit={handleOpenEdit}
          onDelete={setDeletingProduct}
          onReset={handleResetFilters}
        />
      </Container>
      <ProductForm
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
      <DeleteModal
        show={Boolean(deletingProduct)}
        onHide={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
      />
      <AppFooter />
    </div>
  );
}

export default App;
