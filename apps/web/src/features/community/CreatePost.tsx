import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useCreatePost } from "@studyflow/api";
import { COMMUNITY_TAGS } from "@studyflow/shared";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    createPost.mutate(
      {
        content: content.trim(),
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      },
      {
        onSuccess: () => {
          navigate("/community");
        },
      },
    );
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-warm rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </button>
        <h1 className="font-display text-xl font-bold text-charcoal">
          发布动态
        </h1>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的学习心得、打卡记录或学习方法..."
          className="w-full h-40 resize-none border-none outline-none text-charcoal text-sm leading-relaxed placeholder:text-stone/50"
          maxLength={2000}
        />
        <div className="flex items-center justify-between pt-3 border-t border-mist/20">
          <span className="text-xs text-stone">
            {content.length}/2000
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <h3 className="text-sm font-medium text-charcoal mb-3">添加标签</h3>
        <div className="flex flex-wrap gap-2">
          {COMMUNITY_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                selectedTags.includes(tag)
                  ? "bg-coral text-white"
                  : "bg-warm text-stone hover:bg-coral/10 hover:text-coral"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || createPost.isPending}
          className="px-8"
        >
          {createPost.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "发布"
          )}
        </Button>
      </div>
    </div>
  );
}
