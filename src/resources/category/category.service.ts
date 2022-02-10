import categoryModel from "@/resources/category/category.model";
import Category from "@/resources/category/category.interface";


class CategoryService {
    private category = categoryModel;


    /**
     * Create a new activity
     */
    public async create(title: string, body: string, image: string): Promise<Category> {
        try {
            const category = await this.category.create({title, body, image});
            return category
        } catch (error) {
            throw new Error('Unable to create activity');
        }
    }
}


export default CategoryService
