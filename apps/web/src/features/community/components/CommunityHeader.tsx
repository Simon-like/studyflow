import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";

export function CommunityHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">
          学习社区
        </h1>
        <p className="text-stone text-sm mt-0.5">
          与同学共同进步，相互鼓励加油
        </p>
      </div>
      <Button
        leftIcon={<Plus className="w-4 h-4" />}
        onClick={() => navigate("/community/create")}
      >
        发布动态
      </Button>
    </div>
  );
}
