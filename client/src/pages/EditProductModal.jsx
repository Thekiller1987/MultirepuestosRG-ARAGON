import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalError,
  InputGrid,
  FormGroup,
  Label,
  Input,
  Select,
  ModalActions,
  CancelButton,
  SaveButton,
} from "../styles/ModalStyles"; // 👈 ajusta esta ruta a tus estilos

const EditProductModal = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
  providers,
  allProductsRaw,
}) => {
  const [formData, setFormData] = useState({});
  const [profitPercentage, setProfitPercentage] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        mayoreo: productToEdit.mayoreo ?? "",
        minimo: productToEdit.minimo ?? "",
        maximo: productToEdit.maximo ?? "",
        id_categoria: productToEdit.id_categoria ?? "",
        id_proveedor: productToEdit.id_proveedor ?? "",
        descripcion: productToEdit.descripcion ?? "",
      });
      const cost = parseFloat(productToEdit.costo);
      const price = parseFloat(productToEdit.venta);
      setProfitPercentage(
        cost > 0 && price > 0 ? (((price - cost) / cost) * 100).toFixed(2) : ""
      );
      setModalError("");
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "existencia") return;
    const next = { ...formData, [name]: value };

    if (name === "costo" || name === "venta") {
      const cost = parseFloat(next.costo);
      const price = parseFloat(next.venta);
      setProfitPercentage(
        cost > 0 && price > 0 ? (((price - cost) / cost) * 100).toFixed(2) : ""
      );
    }

    setFormData(next);
    setModalError("");
  };

  const handlePercentageChange = (e) => {
    const percentage = e.target.value;
    setProfitPercentage(percentage);
    const cost = parseFloat(formData.costo);
    if (cost > 0 && percentage) {
      setFormData((prev) => ({
        ...prev,
        venta: (cost * (1 + parseFloat(percentage) / 100)).toFixed(2),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalError("");
    const f = formData;

    if (!f.codigo || !f.nombre || !f.costo || !f.venta) {
      setModalError("Código, Nombre, Costo y Venta son obligatorios.");
      return;
    }
    if (parseFloat(f.venta) < parseFloat(f.costo)) {
      setModalError("El precio de venta no puede ser menor que el costo.");
      return;
    }

    const duplicate = allProductsRaw.find(
      (p) =>
        p.id_producto !== productToEdit.id_producto &&
        (p.codigo?.toLowerCase() === f.codigo.trim().toLowerCase() ||
          p.nombre?.toLowerCase() === f.nombre.trim().toLowerCase())
    );
    if (duplicate) {
      setModalError("Ya existe otro producto con ese código o nombre.");
      return;
    }

    // 🧼 Armamos payload limpio
    const { existencia, ...payload } = {
      ...f,
      mayoreo: f.mayoreo || null,
      minimo: f.minimo || null,
      maximo: f.maximo || null,
      id_categoria: f.id_categoria || null,
      id_proveedor: f.id_proveedor || null,
      descripcion: f.descripcion || "",
    };

    console.log("🟡 Enviando payload editado:", payload);
    onSave(payload, productToEdit.id_producto);
  };

  if (!isOpen || !productToEdit) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
        <ModalContent as="div" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit}>
            <ModalTitle>Editar Producto</ModalTitle>
            {modalError && <ModalError>{modalError}</ModalError>}
            <InputGrid>
              <FormGroup>
                <Label>Código</Label>
                <Input
                  name="codigo"
                  value={formData.codigo || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Nombre</Label>
                <Input
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Costo (C$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="costo"
                  value={formData.costo || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>% Ganancia</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={profitPercentage || ""}
                  onChange={handlePercentageChange}
                  placeholder="ej: 50"
                />
              </FormGroup>
              <FormGroup>
                <Label>Precio Venta (C$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="venta"
                  value={formData.venta || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Precio Mayoreo (C$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="mayoreo"
                  value={formData.mayoreo || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Existencia</Label>
                <Input
                  name="existencia"
                  value={formData.existencia || ""}
                  disabled
                  style={{ backgroundColor: "#f0f0f0" }}
                />
                <small style={{ color: "#dc3545", fontWeight: "bold" }}>
                  ¡Ajustar solo con el botón de stock!
                </small>
              </FormGroup>
              <FormGroup>
                <Label>Stock Mínimo</Label>
                <Input
                  type="number"
                  name="minimo"
                  value={formData.minimo || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Stock Máximo</Label>
                <Input
                  type="number"
                  name="maximo"
                  value={formData.maximo || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Descripción</Label>
                <Input
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={handleInputChange}
                  placeholder="Detalles del producto"
                />
              </FormGroup>
              <FormGroup>
                <Label>Categoría</Label>
                <Select
                  name="id_categoria"
                  value={formData.id_categoria || ""}
                  onChange={handleInputChange}
                >
                  <option value="">-- Sin Categoría --</option>
                  {categories.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Proveedor</Label>
                <Select
                  name="id_proveedor"
                  value={formData.id_proveedor || ""}
                  onChange={handleInputChange}
                >
                  <option value="">-- Sin Proveedor --</option>
                  {providers.map((p) => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.nombre}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Tipo de Venta</Label>
                <Select
                  name="tipo_venta"
                  value={formData.tipo_venta || "Unidad"}
                  onChange={handleInputChange}
                >
                  <option value="Unidad">Unidad</option>
                  <option value="Juego">Juego</option>
                  <option value="Kit">Kit</option>
                </Select>
              </FormGroup>
            </InputGrid>
            <ModalActions>
              <CancelButton type="button" onClick={onClose}>
                Cancelar
              </CancelButton>
              <SaveButton type="submit">Guardar Cambios</SaveButton>
            </ModalActions>
          </form>
        </ModalContent>
      </motion.div>
    </ModalOverlay>
  );
};

export default EditProductModal;
