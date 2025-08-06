import { useState } from 'react';
import { useData, Product, ProductVariant } from '@/contexts/DataContext';
import { useDialog } from '@/contexts/DialogContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from '@/components/ImageUpload';
import { Plus, Search, Edit, Trash2, Package, X } from 'lucide-react';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const { showConfirm, showAlert } = useDialog();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    images: [] as string[],
    variants: [] as ProductVariant[]
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateVariantId = () => 'v' + Date.now().toString();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      images: [],
      variants: []
    });
    setEditingProduct(null);
  };

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        images: [...product.images],
        variants: [...product.variants]
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: generateVariantId(), name: '', stock: 0 }]
    }));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const getTotalStock = () => {
    return formData.variants.reduce((sum, variant) => sum + variant.stock, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        totalStock: getTotalStock()
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      closeDialog();
    } catch (error) {
      showAlert({
        title: 'Error',
        message: 'Failed to save product. Please try again.',
        type: 'error'
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirmed = await showConfirm({
      title: t('products.delete'),
      message: t('message.deleteConfirm'),
      type: 'danger',
      confirmText: t('products.delete'),
      cancelText: t('common.cancel')
    });

    if (confirmed) {
      try {
        await deleteProduct(id);
        showAlert({
          title: t('message.success'),
          message: t('message.productDeleted'),
          type: 'success'
        });
      } catch (error) {
        showAlert({
          title: t('message.error'),
          message: t('message.error'),
          type: 'error'
        });
      }
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: t('products.stock'), color: 'bg-red-100 text-red-700' };
    if (stock < 10) return { text: t('products.stock'), color: 'bg-yellow-100 text-yellow-700' };
    return { text: t('products.stock'), color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('products.title')}</h1>
          <p className="text-gray-600 mt-2">{t('products.title')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="bg-dashboard-primary hover:bg-dashboard-primary-light">
              <Plus className="w-4 h-4 mr-2" />
              {t('products.addNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? t('products.editProduct') : t('products.addProduct')}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? t('products.editProduct') : t('products.addProduct')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">{t('products.productName')}</TabsTrigger>
                  <TabsTrigger value="images">{t('products.productImages')}</TabsTrigger>
                  <TabsTrigger value="variants">{t('products.variants')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t('products.productName')}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t('products.productName')}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">{t('products.productDescription')}</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={t('products.productDescription')}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="price">{t('products.productPrice')} (BD)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">{t('products.productImages')}</Label>
                    <p className="text-sm text-gray-600 mb-4">{t('products.productImages')}</p>
                    <ImageUpload
                      images={formData.images}
                      onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                      maxImages={10}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Label className="text-base font-medium">{t('products.variants')}</Label>
                        <p className="text-sm text-gray-600">{t('products.variants')}</p>
                      </div>
                      <Button type="button" onClick={addVariant} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('products.addVariant')}
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <Card key={variant.id || index} className="p-4">
                          <div className="flex gap-4 items-end">
                            <div className="flex-1">
                              <Label htmlFor={`variant-name-${index}`}>{t('products.variantName')}</Label>
                              <Input
                                id={`variant-name-${index}`}
                                value={variant.name}
                                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                placeholder={t('products.variantName')}
                                required
                              />
                            </div>
                            <div className="w-32">
                              <Label htmlFor={`variant-stock-${index}`}>{t('products.variantStock')}</Label>
                              <Input
                                id={`variant-stock-${index}`}
                                type="number"
                                min="0"
                                value={variant.stock}
                                onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                required
                              />
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => removeVariant(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                      
                      {formData.variants.length === 0 && (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                          <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>{t('products.variants')}</p>
                          <p className="text-sm">{t('products.addVariant')}</p>
                        </div>
                      )}
                    </div>

                    {formData.variants.length > 0 && (
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mt-4">
                        <span className="font-medium">{t('products.stock')}:</span>
                        <span className="text-xl font-bold text-dashboard-primary">
                          {getTotalStock()}
                        </span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  {t('products.cancel')}
                </Button>
                <Button type="submit" className="bg-dashboard-primary hover:bg-dashboard-primary-light">
                  {editingProduct ? t('products.save') : t('products.addProduct')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('products.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.totalStock);
          const primaryImage = product.images[0];
          
          return (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 relative">
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {product.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{product.images.length - 1} more
                    </div>
                  )}
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-dashboard-primary">
                      BD {product.price.toFixed(2)}
                    </span>
                    <Badge className={stockStatus.color}>
                      {stockStatus.text}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>{product.totalStock} {t('products.stock')}</span>
                  </div>

                  {product.variants.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">{t('products.variants')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.variants.slice(0, 3).map((variant) => (
                          <Badge key={variant.id} variant="outline" className="text-xs">
                            {variant.name} ({variant.stock})
                          </Badge>
                        ))}
                        {product.variants.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.variants.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openDialog(product)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {t('products.edit')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first product'}
            </p>
            <Button 
              className="mt-4 bg-dashboard-primary hover:bg-dashboard-primary-light"
              onClick={() => openDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
