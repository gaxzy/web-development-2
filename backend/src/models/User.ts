import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import bcrypt from "bcryptjs";

class User extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public created_at!: Date;

    async checkPassword(password: string) {
        return bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.CHAR(60),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "Users",
        timestamps: false,
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 10);
            },
        },
    }
);

export default User;
