import { Link } from "react-router-dom"
import { ChefHat, UtensilsCrossed, BookOpen, Sparkles, ArrowRight } from "lucide-react"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 backdrop-blur-md bg-white/90">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FLAVORI</span>
            </div>
            <div className="hidden items-center space-x-6 sm:flex">
              <Link to="/login" className="font-medium text-gray-600 transition-colors hover:text-orange-600">
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-white bg-orange-600 rounded-md transition-colors hover:bg-orange-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="overflow-hidden relative pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-80"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300 rounded-full opacity-20 blur-3xl -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="items-center py-20 lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="sm:text-center lg:text-left lg:col-span-6">
              <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
                Your personal cooking companion
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Cook with</span>
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">confidence</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Your personal recipe collection, ingredient-based search, and AI-powered cooking assistant. Everything
                you need to create amazing meals.
              </p>
              <div className="mt-10 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="inline-flex justify-center items-center px-6 py-3 w-full text-base font-medium text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-md shadow-lg transition-all duration-200 transform sm:w-auto hover:from-orange-700 hover:to-amber-600 hover:-translate-y-1 hover:shadow-xl"
                >
                  Get started
                  <ArrowRight className="ml-2 w-5 h-5 animate-pulse" />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex justify-center items-center px-6 py-3 w-full text-base font-medium text-gray-700 bg-white rounded-md border border-gray-200 shadow-md transition-all duration-200 transform sm:w-auto hover:bg-gray-50 hover:text-orange-600 hover:-translate-y-1"
                >
                  Explore recipes
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="overflow-hidden relative rounded-2xl shadow-2xl transition-transform duration-300 transform rotate-1 hover:rotate-0">
                <img
                  className="w-full h-[500px] object-cover"
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Cooking"
                />
                <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="inline-block px-4 py-2 mb-2 text-sm font-bold text-white bg-orange-600 rounded-full">
                    Discover new flavors
                  </div>
                  <h3 className="text-2xl font-bold text-white">Thousands of recipes at your fingertips</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-wide text-orange-600 uppercase">Features</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to cook like a pro</p>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Powerful tools and features to make your cooking journey enjoyable and successful.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ChefHat,
                  title: "Recipe Collection",
                  description: "Save and organize your favorite recipes in one place. Access them anytime, anywhere.",
                },
                {
                  icon: UtensilsCrossed,
                  title: "Smart Search",
                  description: "Find the perfect recipe based on ingredients you already have in your kitchen.",
                },
                {
                  icon: BookOpen,
                  title: "Recipe Explorer",
                  description: "Discover new recipes from around the world with our extensive database.",
                },
                {
                  icon: Sparkles,
                  title: "AI Assistant",
                  description: "Get personalized recommendations and cooking tips from our AI helper.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative p-6 bg-white rounded-lg border border-gray-100 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex justify-center items-center w-12 h-12 text-white bg-orange-600 rounded-md">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-orange-600">
        <div className="absolute inset-0 opacity-20">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Cooking background"
          />
        </div>
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to start cooking?
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-orange-50">
            Join thousands of home chefs who are already creating amazing meals with RecipeHub. Sign up today and get
            access to all our features.
          </p>
          <div className="flex flex-col gap-4 mt-8 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex justify-center items-center px-6 py-3 text-base font-medium text-orange-600 bg-white rounded-md shadow-md transition-colors hover:bg-gray-50"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-600 bg-gray-100">
        <div className="px-4 pb-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
         
          <div className="pt-8 border-gray-200 order-t">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ChefHat className="w-6 h-6 text-orange-600" />
                <span className="ml-2 font-medium text-gray-900">RecipeHub</span>
              </div>
              <p className="text-gray-500">&copy; {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage