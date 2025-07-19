import React from "react";
import { useTranslations } from "next-intl";
import { MessageSquareMore, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Image,
  Link,
} from "@heroui/react";

const PostCard = ({ post, isSelected, onToggle }) => {
  const t = useTranslations("RedditDashboard");
  const tCommon = useTranslations("components");
  return (
    <Checkbox
      className={`m-0 box-border bg-[#1E2939] rounded-xl border-2 ${isSelected ? " border-orange-400 dark:dark:ring-orange-400" : "border-transparent"}`}
      isSelected={isSelected}
      onValueChange={() => onToggle(post)}
    >
      <Card
        className={`w-[340px] cursor-pointer transition-all duration-300 z-10`}
        onClick={() => onToggle && onToggle(!isSelected)}
      >
        <CardHeader className="flex items-start gap-3 pl-2">
          <Image
            classNames={{
              wrapper: "shrink-0",
            }}
            alt={post.community || "Community logo"}
            height={40}
            radius="sm"
            src={
              post.avatarUrl ||
              "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            }
            width={40}
          />
          <div className="flex flex-col">
            <p className="pr-2 xl:w-70 md:w-100 sm:w-84 text-md line-clamp-2 min-h-12 font-medium text-gray-800 dark:text-gray-200">
              {post.title}
            </p>
            <p className="text-small text-default-500">r/{post.subreddit}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className={`line-clamp-4 min-h-24 text-gray-600 dark:text-gray-400 ${post.selftext || 'text-center leading-24'}`}>
            {post.selftext ? post.selftext : t("noContent")}
          </p>
        </CardBody>
        <Divider />
        <CardFooter className="flex gap-5 text-sm items-start justify-center">
          <div className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <ThumbsUp size={16} color="#FF5252" /> {post.upvote_ratio}<span className="text-xs">({tCommon("upvoteRatio")})</span>
          </div>
          <div className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MessageSquareMore size={16} color="#3395FF" /> {post.num_comments}<span className="text-xs">({tCommon("commentTotal")})</span>
          </div>
          <Link
            isExternal
            showAnchorIcon
            href={post.url || "https://github.com/heroui-inc/heroui"}
            className="text-sm text-orange-500 hover:text-white dark:text-orange-400 dark:hover:text-orange-300"
          >
            Link
          </Link>
        </CardFooter>
      </Card>
    </Checkbox>
  );
};

export default PostCard;
