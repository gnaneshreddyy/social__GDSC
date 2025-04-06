import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import PostDetail from "./PostDetail";

export default function Home({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  
  const postsPerPage = 10;

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const skip = (currentPage - 1) * postsPerPage;
        const res = await fetch(`https://dummyjson.com/posts?limit=${postsPerPage}&skip=${skip}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      // If search is empty, reset to first page of all posts
      setCurrentPage(1);
      const res = await fetch(`https://dummyjson.com/posts?limit=${postsPerPage}`);
      const data = await res.json();
      setPosts(data.posts);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
      
      if (!res.ok) {
        throw new Error("Search failed");
      }
      
      const data = await res.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle post selection
  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  // Handle back to posts list
  const handleBackToList = () => {
    setSelectedPost(null);
  };

  // Sort posts
  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    
    let sortedPosts = [...posts];
    if (sortValue === "likes") {
      sortedPosts.sort((a, b) => b.reactions - a.reactions);
    } else if (sortValue === "title") {
      sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setPosts(sortedPosts);
  };

  // Filter posts based on search
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-blue-600">Post Feed</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* If a post is selected, show post detail view */}
      {selectedPost ? (
        <PostDetail post={selectedPost} onBack={handleBackToList} />
      ) : (
        <>
          {/* Search and sort controls */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-l px-4 py-2 w-full md:w-64"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
              >
                Search
              </button>
            </form>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSort}
                className="border rounded px-4 py-2"
              >
                <option value="default">Default</option>
                <option value="likes">Most Liked</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          {/* Loading and error states */}
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Posts grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredPosts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onClick={() => handlePostClick(post)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600">No posts found.</p>
                </div>
              )}

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-100">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={posts.length < postsPerPage || loading}
                  className="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}