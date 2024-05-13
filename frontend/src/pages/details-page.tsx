import { useLocation, useNavigate, useParams } from 'react-router-dom';
import navigateBackWhiteIcon from '@/assets/svg/navigate-back-white.svg';
import formatPostTime from '@/utils/format-post-time';
import CategoryPill from '@/components/category-pill';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FeaturedPostCard from '@/components/featured-post-card';
import LatestPostCard from '@/components/latest-post-card';
import { FeaturedPostCardSkeleton } from '@/components/skeletons/featured-post-card-skeleton';
import { LatestPostCardSkeleton } from '@/components/skeletons/latest-post-card-skeleton';
import { categories } from '@/utils/category-colors';

export default function DetailsPage() {
  const { state } = useLocation();
  const [post, setPost] = useState(state?.post);
  const initialVal = post === undefined;
  const [DPloading, setIsLoading] = useState(initialVal);
  const { postId } = useParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [posts, setPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let categoryEndpoint =
      selectedCategory === 'featured'
        ? '/api/posts/featured'
        : `/api/posts/categories/${selectedCategory}`;

    setLoading(true);
    axios
      .get(import.meta.env.VITE_API_PATH + categoryEndpoint)
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedCategory]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_PATH + '/api/posts/latest')
      .then((response) => {
        setLatestPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const getPostById = async () => {
      try {
        await axios.get(import.meta.env.VITE_API_PATH + `/api/posts/${postId}`).then((response) => {
          console.log(response.data);
          setIsLoading(false);
          setPost(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (post === undefined) {
      getPostById();
    }
  }, [post]);

  if (!loading)
    return (
      <div className="flex-grow bg-light dark:bg-dark">
        <div className="relative flex flex-col">
          <img src={post.imageLink} alt={post.title} className="h-80 w-full object-cover md:h-96" />
          <div className="absolute left-0 top-0 h-full w-full bg-slate-950/60"></div>
          <div className="absolute top-12 w-full cursor-pointer justify-start px-2 text-lg text-slate-50 md:top-20 md:px-8 md:text-xl lg:px-12 lg:text-2xl">
            <img
              alt="white"
              src={navigateBackWhiteIcon}
              className="active:scale-click h-5 w-10"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="absolute bottom-6 w-full max-w-xl px-4 text-slate-50 md:bottom-8 md:max-w-3xl md:px-8 lg:bottom-12 lg:max-w-5xl lg:px-12">
            <div className="mb-4 flex space-x-2">
              {post.categories.map((category: string, idx: number) => (
                <CategoryPill key={idx} category={category} />
              ))}
            </div>
            <h1 className="mb-4 text-xl font-semibold md:text-2xl lg:text-3xl">{post.title}</h1>
            <p className="text-xs font-semibold text-dark-secondary md:text-sm">
              {post.authorName}
            </p>
            <p className="text-xs text-dark-secondary/80 md:text-sm">
              {formatPostTime(post.timeOfPost)}
            </p>
          </div>
        </div>

        <div className="mx-auto my-6">
          <div className="flex flex-row justify-start">
            <div className="md:w-2/3">
              <div className="flex flex-col">
                <div className="ml-32 flex max-w-3xl flex-col items-center py-10">
                  <div className="flex flex-wrap dark:rounded-lg dark:bg-dark-card dark:p-3">
                    <p className="leading-7 text-light-secondary dark:text-dark-secondary md:text-lg">
                      {post.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-3/12 flex flex-col py-10">
              <div className="mb-6">
                <div className="-mb-1 cursor-text text-base tracking-wide text-light-tertiary dark:text-dark-tertiary">
                  Discover by topic
                </div>
                <h2 className="mb-2 cursor-text text-xl font-semibold dark:text-dark-primary">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-3 dark:rounded-lg dark:bg-dark-card dark:p-3">
                  {categories.map((category) => (
                    <button
                      name="category"
                      key={category}
                      aria-label={category}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(selectedCategory === category ? 'featured' : category)
                      }
                    >
                      <CategoryPill category={category} selected={selectedCategory === category} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="-mb-1 cursor-text text-base tracking-wide text-slate-500 dark:text-dark-tertiary">
                  What's new?
                </div>
                <h2 className="mb-2 cursor-text text-xl font-semibold dark:text-dark-primary">
                  Latest Posts
                </h2>
                <div className="flex flex-col gap-4">
                  {latestPosts.length === 0
                    ? Array(5)
                        .fill(0)
                        .map((_, index) => <LatestPostCardSkeleton key={index} />)
                    : latestPosts
                        .slice(0, 5)
                        .map((post, index) => <LatestPostCard key={index} post={post} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  else return <h1>Loading...</h1>;
}
