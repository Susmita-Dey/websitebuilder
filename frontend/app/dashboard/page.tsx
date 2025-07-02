"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Website } from "@/lib/types";

const DashboardPage = () => {
  const [websites, setWebsites] = useState<Website[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await fetch("/api/websites");
        const data = await res.json();
        setWebsites(data.websites || []);
      } catch (error) {
        console.error("Failed to load websites", error);
        setWebsites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <div className="mx-auto container px-16 py-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">My Websites</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[250px] rounded-xl" />
          ))}
        </div>
      ) : websites && websites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <div
              key={website.id}
              className="border rounded-xl shadow-sm overflow-hidden bg-background"
            >
              <div className="h-[180px] bg-muted flex items-center justify-center text-muted-foreground text-sm">
                <span className="px-4 text-center">
                  {website.pages[0]?.name || "No Homepage"}
                </span>
              </div>

              <div className="p-4 border-t">
                <h3 className="font-semibold text-lg">{website?.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {website?.description || "No description available"}
                </p>

                <Link href={`/project/${website.id}`} className="block mt-4">
                  <Button variant="outline" className="w-full">
                    View Project
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center mt-12">
          You haven’t created any websites yet.
        </p>
      )}
    </div>
  );
};

export default DashboardPage;
