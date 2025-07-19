import React, { useContext } from "react";
import { useTranslations } from "next-intl";
import PostCard from "../PostCard";
import { PostSelectionContext } from "@/components/RedditDashboard";

const PostGrid = ({
  posts,
  selectedPosts,
  onTogglePost,
  isHighCorrelation,
}) => {
 
  const t = useTranslations("RedditDashboard");
  return (
    <>
      {posts.length !== 0 ? (
        isHighCorrelation ? (
          <div className="mb-5 rounded-2xl border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 p-4 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#E34D00]"></div>
              <p className="text-xl font-semibold tracking-wide text-white">
                {t("highCorrelation")}
              </p>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white/80">
                {t("items", {
                  num: posts.length,
                })}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isSelected={!!selectedPosts[post.id]}
                  onToggle={() => onTogglePost(post.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 p-4 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-amber-400"></div>
              <p className="text-xl font-semibold tracking-wide text-white">
                {t("lowCorrelation")}
              </p>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm text-white/80">
                {t("items", {
                  num: posts.length,
                })}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isSelected={!!selectedPosts[post.id]}
                  onToggle={() => onTogglePost(post.id)}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="mb-5 rounded-2xl border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 p-4 shadow-lg">
          {isHighCorrelation ? (
            <p className="text-center text-xl font-semibold tracking-wide text-white">
              {t("highCorrelationPostNoData")}
            </p>
          ) : (
            <p className="text-center text-xl font-semibold tracking-wide text-white">
              {t("lowCorrelationPostNoData")}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default PostGrid;
