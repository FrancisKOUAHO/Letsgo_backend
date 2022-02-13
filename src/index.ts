import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import ActivityController from '@/resources/activity/activity.controller';
import UserController from '@/resources/user/user.controller';
import CategoryController from "@/resources/category/category.controller";

validateEnv();

const app = new App(
    [new ActivityController(), new UserController(), new CategoryController()],
    Number(process.env.PORT || 80)
);
app.listen();
