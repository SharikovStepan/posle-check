"use client";
import { FriendsListResult, GetFriendsOptions } from "@/app/lib/types/types.friends";
import EditMemberCard from "./editMemberCard";
import { getFriendsList } from "@/app/lib/data/data.friendship";
import Pagination from "../paginaton";
import { useCallback, useEffect, useRef, useState } from "react";
import { User } from "@/app/lib/types/types.user";

const FRIEND_LIST_LIMIT = 5;

const getUnchoosedMembers = (fetchUsersArr: User[], choosedMemberArr: User[]): User[] => {
  const choosedIds = choosedMemberArr.map((member) => member.id);
  return fetchUsersArr.filter((user) => !choosedIds.includes(user.id));
};

const markChoosedMembers = (fetchUsersArr: User[], choosedMemberArr: User[]): User[] => {
  const choosedIds = choosedMemberArr.map((member) => member.id);
  return fetchUsersArr.map((user) => {
    if (choosedIds.includes(user.id)) {
      return { ...user, marked: true };
    } else {
      return { ...user };
    }
  });
};

export default function SearchMembersList({ options, initialData, choosedMembers }: { options: GetFriendsOptions; initialData: FriendsListResult; choosedMembers: User[] }) {
  const [usersData, setUsersData] = useState<User[]>(initialData.users);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFirstRender = useRef<boolean>(true);

  const [responseInfo, setResponseInfo] = useState<{ total: number; totalPages: number; page: number }>({
    total: initialData.total,
    totalPages: initialData.totalPages,
    page: initialData.page,
  });

  const [paginatonPage, setPaginatonPage] = useState<number>(responseInfo.page);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const abortController = new AbortController();

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();

        params.set("currentUserId", options.currentUserId);

        params.set("filter", options.filter || "friends");

        if (options.search) {
          params.set("search", options.search);
        }

        if (options.sortBy) {
          params.set("sortBy", options.sortBy);
        }

        if (options.order) {
          params.set("order", options.order);
        }

        params.set("page", paginatonPage.toString());

        const choosedMembersCount = choosedMembers.length;
        // const limit = paginatonPage > 1 ? FRIEND_LIST_LIMIT : FRIEND_LIST_LIMIT + choosedMembersCount;
        const limit = FRIEND_LIST_LIMIT || 5;
        params.set("limit", limit.toString());

        const response = await fetch(`/api/friends?${params}`, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: FriendsListResult = await response.json();

        setUsersData(data.users);

        setResponseInfo({ total: data.total, totalPages: data.totalPages, page: data.page });
      } catch (err) {
        //   setError(err.message);
        console.error("Failed to load users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    return () => {
      console.log("ABORT!");
      if (abortController) {
        abortController.abort();
      }
    };
  }, [options.search, paginatonPage, options.order, options.sortBy]);

  useEffect(() => {
    console.log("paginatonPage", paginatonPage);
  }, [paginatonPage]);

  useEffect(() => {
    //  if (responseInfo.totalPages == 1) {
    //    setPaginatonPage(1);
    //  }
  }, [responseInfo]);

  const marked = markChoosedMembers(usersData, choosedMembers);

  return (
    <div>
      <div className="flex flex-col gap-3 w-full min-h-150">
        {marked.length > 0
          ? marked.map((user, index) => {
              const isMarked = user.marked || false;
              return <EditMemberCard key={user.id} marked={isMarked} userData={user} />;
            })
          : ""}

        <div className={`${responseInfo.totalPages == 1 ? "hidden" : "block self-center"}`}>
          <Pagination mode="state" onPageChange={setPaginatonPage} totalPages={responseInfo.totalPages} currentPage={responseInfo.page} />
        </div>
      </div>
    </div>
  );
}
