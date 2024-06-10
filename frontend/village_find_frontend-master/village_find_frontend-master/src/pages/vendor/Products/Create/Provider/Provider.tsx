import { createContext, useState } from "react";

interface IStyleImage {
    images: (File | null)[];
}

interface IProductContext {
    deliveryTypes: string[];
    setDeliveryTypes: (_: string[]) => void;
    nutrition: File | null;
    setNutrition: (_: File | null) => void;
    image: File | null;
    setImage: (_: File | null) => void;
    styleImages: IStyleImage[];
    setStyleImages: (_: IStyleImage[]) => void;
}

export const ProductContext = createContext<IProductContext>({
    deliveryTypes: [],
    setDeliveryTypes: () => { },
    nutrition: null,
    setNutrition: () => { },
    image: null,
    setImage: () => { },
    styleImages: [],
    setStyleImages: () => { }
});

interface IProductProviderProps {
    children: React.ReactNode;
}

function ProductProvider({ children }: IProductProviderProps) {
    const [deliveryTypes, setDeliveryTypes] = useState<string[]>([]);
    const [nutrition, setNutrition] = useState<File | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [styleImages, setStyleImages] = useState<IStyleImage[]>([]);

    return <ProductContext.Provider value={{ deliveryTypes, setDeliveryTypes, nutrition, setNutrition, image, setImage, styleImages, setStyleImages }}>
        {children}
    </ProductContext.Provider>
}

export { ProductProvider };