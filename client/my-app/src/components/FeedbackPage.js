import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageSquare, User, Star, Send, Smile, Frown, ThumbsUp, MessageCircle } from "lucide-react";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !feedback) {
      toast.warn("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending feedback to the server
    setTimeout(() => {
      console.log({
        username,
        email,
        feedback,
        rating,
        feedbackType
      });
      
      toast.success("Thank you for your feedback!");
      
      // Reset form
      setFeedback("");
      setUsername("");
      setEmail("");
      setRating(0);
      setFeedbackType("general");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <section className="relative h-[200px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-700/70 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1740&auto=format&fit=crop"
          alt="Feedback"
          className="object-cover w-full h-full"
        />
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-20">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              We Value Your <span className="text-amber-400">Feedback</span>
            </h1>
            <p className="text-gray-200 md:max-w-md">
              Help us improve your recipe experience
            </p>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MessageSquare className="mr-2 text-indigo-600" />
              Share Your Thoughts
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your name"
                      required
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Feedback Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackType("general")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                      feedbackType === "general" 
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <MessageCircle className="h-6 w-6 mb-1" />
                    <span className="text-sm">General</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFeedbackType("suggestion")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                      feedbackType === "suggestion" 
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ThumbsUp className="h-6 w-6 mb-1" />
                    <span className="text-sm">Suggestion</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFeedbackType("bug")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                      feedbackType === "bug" 
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Frown className="h-6 w-6 mb-1" />
                    <span className="text-sm">Bug Report</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFeedbackType("compliment")}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                      feedbackType === "compliment" 
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Smile className="h-6 w-6 mb-1" />
                    <span className="text-sm">Compliment</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Rate Your Experience <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`h-8 w-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us what you think, suggest improvements, or report issues..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg flex items-center justify-center transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why Your Feedback Matters</h3>
            <p className="text-gray-600 mb-4">
              We're constantly working to improve your recipe experience. Your feedback helps us identify areas where we can make the app better and more useful for everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-indigo-600 mb-1">New Features</h4>
                <p className="text-sm text-gray-600">Your suggestions help us prioritize which features to build next.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-indigo-600 mb-1">Bug Fixes</h4>
                <p className="text-sm text-gray-600">Report issues to help us make the app more reliable for everyone.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-indigo-600 mb-1">User Experience</h4>
                <p className="text-sm text-gray-600">Your experience matters in shaping how our app evolves.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default FeedbackPage;
