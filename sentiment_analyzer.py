"""
Sentiment Analyzer for The Human Pulse
Uses Claude API to analyze emotions and themes in text
"""

import json
from anthropic import Anthropic

# Initialize Claude client with hardcoded API key

client = Anthropic(api_key='API Key Here')

class SentimentAnalyzer:
    def __init__(self):
        self.model = "claude-sonnet-4-20250514"
        
    def analyze_text(self, text, context="general"):
        """
        Analyze emotions in a piece of text
        
        Args:
            text: The text to analyze
            context: Context hint (e.g., "financial", "work", "mental_health")
            
        Returns:
            Dictionary with emotion scores and themes
        """
        
        prompt = f"""Analyze the emotional content of this text. Provide scores (0-100) for these emotions:

Emotions to score:
- anxiety: Worry, nervousness, unease about the future
- stress: Feeling overwhelmed, pressure, tension
- fear: Dread, panic, terror
- anger: Frustration, rage, resentment
- sadness: Depression, hopelessness, grief
- optimism: Hope, positive outlook, confidence
- excitement: Enthusiasm, anticipation, joy
- contentment: Satisfaction, peace, calm

Also identify:
- Primary struggle (what is the main problem/concern?)
- Key themes (1-3 themes, e.g., "job security", "cost of living", "health")

Text: "{text[:500]}"

Respond ONLY with JSON in this exact format:
{{
  "anxiety": 0-100,
  "stress": 0-100,
  "fear": 0-100,
  "anger": 0-100,
  "sadness": 0-100,
  "optimism": 0-100,
  "excitement": 0-100,
  "contentment": 0-100,
  "primary_struggle": "brief description",
  "themes": ["theme1", "theme2", "theme3"]
}}"""

        try:
            response = client.messages.create(
                model=self.model,
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Extract JSON from response
            response_text = response.content[0].text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```'):
                response_text = response_text.split('```')[1]
                if response_text.startswith('json'):
                    response_text = response_text[4:]
            
            result = json.loads(response_text.strip())
            return result
            
        except Exception as e:
            print(f"Error analyzing text: {e}")
            return None
    
    def analyze_batch(self, texts, context="general", max_items=None):
        """
        Analyze multiple texts
        
        Args:
            texts: List of text strings
            context: Context hint
            max_items: Maximum number of items to process (None = all)
            
        Returns:
            List of analysis results
        """
        if max_items:
            texts = texts[:max_items]
            
        results = []
        total = len(texts)
        
        for i, text in enumerate(texts, 1):
            print(f"Analyzing {i}/{total}...", end='\r')
            result = self.analyze_text(text, context)
            if result:
                results.append(result)
                
        print(f"\nCompleted: {len(results)}/{total} analyzed")
        return results
    
    def aggregate_emotions(self, analyses):
        """
        Aggregate emotion scores across multiple analyses
        
        Args:
            analyses: List of analysis dictionaries
            
        Returns:
            Dictionary with average scores and top themes
        """
        if not analyses:
            return None
            
        # Calculate averages
        emotions = ['anxiety', 'stress', 'fear', 'anger', 'sadness', 
                   'optimism', 'excitement', 'contentment']
        
        aggregated = {
            'sample_size': len(analyses),
            'emotions': {},
            'top_struggles': [],
            'top_themes': []
        }
        
        # Average emotion scores
        for emotion in emotions:
            scores = [a.get(emotion, 0) for a in analyses if a.get(emotion) is not None]
            if scores:
                aggregated['emotions'][emotion] = round(sum(scores) / len(scores), 1)
        
        # Collect themes
        all_themes = []
        all_struggles = []
        
        for analysis in analyses:
            if analysis.get('themes'):
                all_themes.extend(analysis['themes'])
            if analysis.get('primary_struggle'):
                all_struggles.append(analysis['primary_struggle'])
        
        # Count theme frequency
        theme_counts = {}
        for theme in all_themes:
            theme_lower = theme.lower()
            theme_counts[theme_lower] = theme_counts.get(theme_lower, 0) + 1
        
        # Sort by frequency
        sorted_themes = sorted(theme_counts.items(), key=lambda x: x[1], reverse=True)
        aggregated['top_themes'] = [{'theme': t[0], 'count': t[1]} for t in sorted_themes[:10]]
        
        # Top struggles (just first 10)
        aggregated['top_struggles'] = all_struggles[:10]
        
        return aggregated


def analyze_reddit_data(reddit_json_file, output_file='sentiment_results.json', max_posts=50):
    """
    Analyze Reddit data collected from reddit_collector.py
    
    Args:
        reddit_json_file: Path to JSON file with Reddit data
        output_file: Where to save results
        max_posts: Maximum number of posts to analyze (API cost control)
    """
    print("=" * 60)
    print("THE HUMAN PULSE - Sentiment Analyzer")
    print("=" * 60)
    
    # Load Reddit data
    print(f"\nLoading data from {reddit_json_file}...")
    with open(reddit_json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    posts = data.get('posts', [])
    print(f"Found {len(posts)} posts")
    
    if max_posts:
        posts = posts[:max_posts]
        print(f"Analyzing first {len(posts)} posts (cost control)")
    
    # Prepare texts
    texts = []
    for post in posts:
        # Combine title and text
        full_text = f"{post['title']}. {post.get('text', '')}"
        texts.append(full_text)
    
    # Analyze
    analyzer = SentimentAnalyzer()
    print("\nAnalyzing emotions...")
    analyses = analyzer.analyze_batch(texts)
    
    # Aggregate
    print("\nAggregating results...")
    aggregated = analyzer.aggregate_emotions(analyses)
    
    # Save results
    results = {
        'aggregated': aggregated,
        'individual_analyses': analyses,
        'metadata': {
            'source_file': reddit_json_file,
            'total_posts_analyzed': len(analyses),
            'collected_at': data.get('metadata', {}).get('collected_at')
        }
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Results saved to {output_file}")
    
    # Print summary
    print("\n" + "=" * 60)
    print("EMOTIONAL SUMMARY")
    print("=" * 60)
    
    if aggregated:
        print(f"\nSample size: {aggregated['sample_size']} posts\n")
        print("EMOTION SCORES (0-100):")
        for emotion, score in aggregated['emotions'].items():
            bar = '█' * int(score / 5)
            print(f"  {emotion.capitalize():12} {score:5.1f} {bar}")
        
        print(f"\nTOP THEMES:")
        for theme_data in aggregated['top_themes'][:5]:
            print(f"  • {theme_data['theme']} ({theme_data['count']} mentions)")
    
    print("=" * 60)


if __name__ == '__main__':
    # Example usage
    analyze_reddit_data('reddit_data.json', max_posts=50)
