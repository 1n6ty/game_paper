import { User } from "@/app/shared-kernel/domain/entities/User";
import { UserRewards } from "./UserRewards";

export interface UserWithRewards extends User, UserRewards {}
