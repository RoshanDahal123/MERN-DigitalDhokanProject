import { Request, Response } from "express";
import Category from "../database/models/categoryModel";
/*
electronics,groceries,food
seed the above data
*/
class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Food",
    },
  ];

  async seedCategory(): Promise<void> {
    const datas = await Category.findAll();
    if (datas.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already saved");
    }
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    //@ts-ignore
    console.log(req.user);
    const { categoryName } = req.body;

    if (!categoryName) {
      res.status(400).json({
        message: "Please provide the category Name",
      });
      return;
    }

    const category = await Category.create({
      categoryName,
    });
    res.status(200).json({
      message: "Category created successfully",
      data: category,
    });
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "fetched categories",
      data,
    });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "Please provide id to delete",
      });
    }
    const data = await Category.findAll({
      where: {
        id: id,
      },
    }); //array return
    //const data=await Category.findByPk(id)// object return

    if (data.length === 0) {
      res.status(404).json({
        message: "No category with that id",
      });
    } else {
      await Category.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Category deleted successfully",
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!id || !categoryName) {
      res.status(200).json({
        message: "Please Provide id to update , categoryName to update",
      });
      return;
    }
    const data = await Category.findAll({
      where: {
        id: id,
      },
    });
    if (data.length === 0) {
      res.status(404).json({
        message: "No category with that id",
      });
    } else {
      await Category.update(
        {
          categoryName: categoryName,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json({ message: "Category name updated" });
    }
  }
}
export default new CategoryController();
