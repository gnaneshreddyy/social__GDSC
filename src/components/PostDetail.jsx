import { useState, useEffect } from "react";

export default function PostDetail({ post, onBack }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://dummyjson.com/posts/${post.id}/comments`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }
        
        const data = await res.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [post.id]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts
        </button>

        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">{post.body}</p>
        
        <div className="flex items-center mb-6 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-1.106l-3.5-7A2 2 0 017.247 10H12" />
          </svg>
          <span>{post.reactions.likes} likes</span>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{comment.user?.username || "Anonymous"}</p>
                  <p className="text-gray-700 mt-1">{comment.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}