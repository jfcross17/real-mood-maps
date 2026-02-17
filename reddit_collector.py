"""
Reddit Data Collector for The Human Pulse
Scrapes posts and comments from emotion/sentiment subreddits
"""

import praw
import os
from datetime import datetime
import json

# Reddit API credentials (you'll need to get these from reddit.com/prefs/apps)
REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID', 'your_client_id')
REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET', 'your_client_secret')
REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT', 'HumanPulse/1.0')

# Subreddits to monitor
TARGET_SUBREDDITS = [
    'anxiety',
    'depression', 
    'jobs',
    'personalfinance',
    'wallstreetbets',
    'collapse',
    'antiwork',
    'careerguidance',
    'povertyfinance',
    'stressed'
]

class RedditCollector:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT
        )
        
    def collect_recent_posts(self, subreddit_name, limit=100, time_filter='day'):
        """
        Collect recent posts from a subreddit
        
        Args:
            subreddit_name: Name of subreddit (without r/)
            limit: Number of posts to collect (max 100 per call)
            time_filter: 'hour', 'day', 'week', 'month'
        
        Returns:
            List of post dictionaries
        """
        subreddit = self.reddit.subreddit(subreddit_name)
        posts = []
        
        # Get top posts from time period
        for post in subreddit.top(time_filter=time_filter, limit=limit):
            post_data = {
                'id': post.id,
                'subreddit': subreddit_name,
                'title': post.title,
                'text': post.selftext,
                'score': post.score,
                'num_comments': post.num_comments,
                'created_utc': datetime.fromtimestamp(post.created_utc).isoformat(),
                'url': post.url,
                'author': str(post.author) if post.author else '[deleted]',
                'collected_at': datetime.utcnow().isoformat()
            }
            posts.append(post_data)
            
        return posts
    
    def collect_comments(self, post_id, limit=50):
        """
        Collect top comments from a post
        
        Args:
            post_id: Reddit post ID
            limit: Number of comments to collect
            
        Returns:
            List of comment dictionaries
        """
        submission = self.reddit.submission(id=post_id)
        submission.comments.replace_more(limit=0)  # Remove "more comments" objects
        
        comments = []
        for comment in submission.comments.list()[:limit]:
            if hasattr(comment, 'body'):
                comment_data = {
                    'id': comment.id,
                    'post_id': post_id,
                    'text': comment.body,
                    'score': comment.score,
                    'created_utc': datetime.fromtimestamp(comment.created_utc).isoformat(),
                    'author': str(comment.author) if comment.author else '[deleted]',
                    'collected_at': datetime.utcnow().isoformat()
                }
                comments.append(comment_data)
                
        return comments
    
    def collect_all_subreddits(self, posts_per_sub=50):
        """
        Collect posts from all target subreddits
        
        Returns:
            Dictionary with all collected data
        """
        all_data = {
            'posts': [],
            'metadata': {
                'collected_at': datetime.utcnow().isoformat(),
                'subreddits': TARGET_SUBREDDITS,
                'posts_per_sub': posts_per_sub
            }
        }
        
        for subreddit in TARGET_SUBREDDITS:
            print(f"Collecting from r/{subreddit}...")
            try:
                posts = self.collect_recent_posts(subreddit, limit=posts_per_sub, time_filter='day')
                all_data['posts'].extend(posts)
                print(f"  ✓ Collected {len(posts)} posts from r/{subreddit}")
            except Exception as e:
                print(f"  ✗ Error collecting from r/{subreddit}: {e}")
                
        return all_data
    
    def save_to_file(self, data, filename='reddit_data.json'):
        """Save collected data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\nSaved {len(data['posts'])} posts to {filename}")


def main():
    """Main execution function"""
    print("=" * 60)
    print("THE HUMAN PULSE - Reddit Data Collector")
    print("=" * 60)
    
    collector = RedditCollector()
    
    # Collect from all subreddits
    data = collector.collect_all_subreddits(posts_per_sub=50)
    
    # Save to file
    collector.save_to_file(data)
    
    print("\n" + "=" * 60)
    print(f"Total posts collected: {len(data['posts'])}")
    print("=" * 60)


if __name__ == '__main__':
    main()
