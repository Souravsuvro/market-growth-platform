import requests
from bs4 import BeautifulSoup
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from collections import Counter
import re
from typing import Dict, List, Any
from urllib.parse import urlparse
import logging

# Download required NLTK data
try:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('vader_lexicon')
except Exception as e:
    logging.error(f"Error downloading NLTK data: {e}")

class CompetitorAnalyzer:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.stop_words = set(stopwords.words('english'))
        self.sia = SentimentIntensityAnalyzer()

    async def analyze_competitor(self, url: str) -> Dict[str, Any]:
        """Analyze a competitor's website and return insights."""
        try:
            # Validate URL
            parsed_url = urlparse(url)
            if not parsed_url.scheme or not parsed_url.netloc:
                raise ValueError("Invalid URL provided")

            # Fetch and parse website content
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract text content
            text_content = self._extract_text(soup)
            
            # Analyze content
            analysis = {
                'key_features': self._extract_key_features(soup),
                'content_analysis': self._analyze_content(text_content),
                'sentiment_analysis': self._analyze_sentiment(text_content),
                'tech_stack': self._detect_technology_stack(soup, response.text),
                'social_presence': self._detect_social_links(soup),
                'meta_info': self._extract_meta_info(soup)
            }

            return analysis

        except Exception as e:
            logging.error(f"Error analyzing competitor website: {e}")
            raise

    def _extract_text(self, soup: BeautifulSoup) -> str:
        """Extract readable text content from the webpage."""
        # Remove script and style elements
        for script in soup(['script', 'style', 'meta', 'link']):
            script.decompose()
        
        # Get text and clean it
        text = soup.get_text(separator=' ')
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def _analyze_content(self, text: str) -> Dict[str, Any]:
        """Analyze text content for key insights."""
        # Tokenize text
        words = word_tokenize(text.lower())
        
        # Remove stop words and non-alphabetic tokens
        words = [word for word in words if word.isalpha() and word not in self.stop_words]
        
        # Get word frequency
        word_freq = Counter(words).most_common(10)
        
        # Calculate readability metrics
        sentences = sent_tokenize(text)
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        
        return {
            'common_terms': dict(word_freq),
            'word_count': len(words),
            'sentence_count': len(sentences),
            'avg_sentence_length': round(avg_sentence_length, 2)
        }

    def _analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of the text content."""
        sentiment_scores = self.sia.polarity_scores(text)
        return {
            'positive': round(sentiment_scores['pos'], 3),
            'neutral': round(sentiment_scores['neu'], 3),
            'negative': round(sentiment_scores['neg'], 3),
            'compound': round(sentiment_scores['compound'], 3)
        }

    def _extract_key_features(self, soup: BeautifulSoup) -> List[str]:
        """Extract potential product/service features."""
        features = []
        
        # Look for lists that might contain features
        for ul in soup.find_all(['ul', 'ol']):
            items = ul.find_all('li')
            if 3 <= len(items) <= 10:  # Reasonable length for feature lists
                features.extend([item.get_text().strip() for item in items])
        
        # Look for headings that might indicate features
        for heading in soup.find_all(['h1', 'h2', 'h3']):
            text = heading.get_text().strip().lower()
            if any(keyword in text for keyword in ['feature', 'benefit', 'service', 'product']):
                features.append(heading.get_text().strip())
        
        return list(set(features))[:10]  # Return unique features, limited to 10

    def _detect_technology_stack(self, soup: BeautifulSoup, html: str) -> Dict[str, List[str]]:
        """Detect technologies used on the website."""
        tech_stack = {
            'frontend': [],
            'analytics': [],
            'cdn': []
        }
        
        # Check for common frontend frameworks
        if 'react' in html.lower():
            tech_stack['frontend'].append('React')
        if 'vue' in html.lower():
            tech_stack['frontend'].append('Vue.js')
        if 'angular' in html.lower():
            tech_stack['frontend'].append('Angular')
            
        # Check for analytics
        if 'google-analytics' in html:
            tech_stack['analytics'].append('Google Analytics')
        if 'hotjar' in html:
            tech_stack['analytics'].append('Hotjar')
            
        # Check for CDNs
        if 'cloudflare' in html:
            tech_stack['cdn'].append('Cloudflare')
        if 'amazonaws' in html:
            tech_stack['cdn'].append('AWS')
            
        return tech_stack

    def _detect_social_links(self, soup: BeautifulSoup) -> List[str]:
        """Detect social media presence."""
        social_platforms = {
            'facebook.com': 'Facebook',
            'twitter.com': 'Twitter',
            'linkedin.com': 'LinkedIn',
            'instagram.com': 'Instagram',
            'youtube.com': 'YouTube'
        }
        
        social_links = []
        for link in soup.find_all('a', href=True):
            href = link['href'].lower()
            for platform_url, platform_name in social_platforms.items():
                if platform_url in href and platform_name not in social_links:
                    social_links.append(platform_name)
                    
        return social_links

    def _extract_meta_info(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract meta information from the website."""
        meta_info = {}
        
        # Get meta description
        meta_desc = soup.find('meta', {'name': 'description'})
        if meta_desc:
            meta_info['description'] = meta_desc.get('content', '')
            
        # Get meta keywords
        meta_keywords = soup.find('meta', {'name': 'keywords'})
        if meta_keywords:
            meta_info['keywords'] = meta_keywords.get('content', '')
            
        # Get title
        title = soup.find('title')
        if title:
            meta_info['title'] = title.string
            
        return meta_info

    async def generate_comparison(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comparative insights from multiple competitor analyses."""
        try:
            comparison = {
                'sentiment_comparison': self._compare_sentiment(analyses),
                'content_metrics_comparison': self._compare_content_metrics(analyses),
                'tech_stack_comparison': self._compare_tech_stack(analyses),
                'social_presence_comparison': self._compare_social_presence(analyses),
                'common_terms_comparison': self._compare_common_terms(analyses),
                'feature_comparison': self._compare_features(analyses),
                'summary': self._generate_comparative_summary(analyses)
            }
            return comparison
        except Exception as e:
            logging.error(f"Error generating comparison: {e}")
            raise

    def _compare_sentiment(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Compare sentiment analysis across competitors."""
        sentiment_comparison = {
            name: analysis['sentiment_analysis']
            for name, analysis in analyses.items()
        }
        
        # Calculate average sentiment scores
        avg_sentiment = {
            'positive': sum(a['sentiment_analysis']['positive'] for a in analyses.values()) / len(analyses),
            'neutral': sum(a['sentiment_analysis']['neutral'] for a in analyses.values()) / len(analyses),
            'negative': sum(a['sentiment_analysis']['negative'] for a in analyses.values()) / len(analyses),
            'compound': sum(a['sentiment_analysis']['compound'] for a in analyses.values()) / len(analyses)
        }
        
        return {
            'individual': sentiment_comparison,
            'average': avg_sentiment
        }

    def _compare_content_metrics(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Compare content metrics across competitors."""
        metrics_comparison = {
            name: {
                'word_count': analysis['content_analysis']['word_count'],
                'sentence_count': analysis['content_analysis']['sentence_count'],
                'avg_sentence_length': analysis['content_analysis']['avg_sentence_length']
            }
            for name, analysis in analyses.items()
        }
        
        # Calculate averages
        avg_metrics = {
            'word_count': sum(m['word_count'] for m in metrics_comparison.values()) / len(analyses),
            'sentence_count': sum(m['sentence_count'] for m in metrics_comparison.values()) / len(analyses),
            'avg_sentence_length': sum(m['avg_sentence_length'] for m in metrics_comparison.values()) / len(analyses)
        }
        
        return {
            'individual': metrics_comparison,
            'average': avg_metrics
        }

    def _compare_tech_stack(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Compare technology stacks across competitors."""
        tech_comparison = {
            name: analysis['tech_stack']
            for name, analysis in analyses.items()
        }
        
        # Find common and unique technologies
        all_tech = {
            'frontend': set(),
            'analytics': set(),
            'cdn': set()
        }
        
        for tech_stack in tech_comparison.values():
            for category in all_tech:
                all_tech[category].update(tech_stack[category])
        
        common_tech = {
            'frontend': set.intersection(*[set(tech['frontend']) for tech in tech_comparison.values()]),
            'analytics': set.intersection(*[set(tech['analytics']) for tech in tech_comparison.values()]),
            'cdn': set.intersection(*[set(tech['cdn']) for tech in tech_comparison.values()])
        }
        
        return {
            'individual': tech_comparison,
            'all_technologies': {k: list(v) for k, v in all_tech.items()},
            'common_technologies': {k: list(v) for k, v in common_tech.items()}
        }

    def _compare_social_presence(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Compare social media presence across competitors."""
        social_comparison = {
            name: analysis['social_presence']
            for name, analysis in analyses.items()
        }
        
        # Find all unique platforms and common platforms
        all_platforms = set()
        for platforms in social_comparison.values():
            all_platforms.update(platforms)
        
        common_platforms = set.intersection(*[set(platforms) for platforms in social_comparison.values()])
        
        return {
            'individual': social_comparison,
            'all_platforms': list(all_platforms),
            'common_platforms': list(common_platforms)
        }

    def _compare_common_terms(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Compare common terms across competitors."""
        terms_comparison = {
            name: analysis['content_analysis']['common_terms']
            for name, analysis in analyses.items()
        }
        
        # Combine all terms and their frequencies
        all_terms = {}
        for comp_terms in terms_comparison.values():
            for term, freq in comp_terms.items():
                if term in all_terms:
                    all_terms[term] += freq
                else:
                    all_terms[term] = freq
        
        # Find terms that appear across all competitors
        common_terms = {}
        for term in all_terms:
            if all(term in comp_terms for comp_terms in terms_comparison.values()):
                common_terms[term] = all_terms[term]
        
        return {
            'individual': terms_comparison,
            'all_terms': dict(sorted(all_terms.items(), key=lambda x: x[1], reverse=True)[:20]),
            'common_terms': dict(sorted(common_terms.items(), key=lambda x: x[1], reverse=True)[:10])
        }

    def _compare_features(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Compare features across competitors."""
        feature_comparison = {
            name: analysis['key_features']
            for name, analysis in analyses.items()
        }
        
        # Find unique features across all competitors
        all_features = set()
        for features in feature_comparison.values():
            all_features.update(features)
        
        # Find common features
        common_features = set.intersection(*[set(features) for features in feature_comparison.values()])
        
        return {
            'individual': feature_comparison,
            'all_features': list(all_features),
            'common_features': list(common_features)
        }

    def _generate_comparative_summary(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a summary of the comparative analysis."""
        summary = {
            'total_competitors': len(analyses),
            'key_findings': []
        }
        
        # Analyze sentiment trends
        sentiment_scores = {
            name: analysis['sentiment_analysis']['compound']
            for name, analysis in analyses.items()
        }
        max_sentiment = max(sentiment_scores.items(), key=lambda x: x[1])
        summary['key_findings'].append(
            f"{max_sentiment[0]} has the most positive content sentiment"
        )
        
        # Analyze content volume
        word_counts = {
            name: analysis['content_analysis']['word_count']
            for name, analysis in analyses.items()
        }
        max_content = max(word_counts.items(), key=lambda x: x[1])
        summary['key_findings'].append(
            f"{max_content[0]} has the most comprehensive content"
        )
        
        # Analyze social presence
        social_counts = {
            name: len(analysis['social_presence'])
            for name, analysis in analyses.items()
        }
        max_social = max(social_counts.items(), key=lambda x: x[1])
        summary['key_findings'].append(
            f"{max_social[0]} has the strongest social media presence"
        )
        
        return summary
