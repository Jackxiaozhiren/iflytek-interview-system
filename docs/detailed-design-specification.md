# iFlytek多模态智能面试评测系统
## 详细设计说明书

---

## 📋 文档信息
- **项目名称**：iFlytek多模态智能面试评测系统
- **文档版本**：v1.0
- **编写日期**：2025年7月
- **文档类型**：详细设计说明书

---

## 🎯 1. 详细功能设计

### 1.1 多模态面试评测核心算法

#### 1.1.1 文本分析算法
```python
class AdvancedTextAnalyzer:
    """高级文本分析器"""
    
    def __init__(self):
        self.technical_keywords_db = self._load_technical_keywords()
        self.logical_patterns = self._load_logical_patterns()
        self.expression_evaluator = ChineseExpressionEvaluator()
    
    def analyze_technical_content(self, text: str, domain: str) -> dict:
        """技术内容深度分析"""
        # 1. 技术关键词识别和权重计算
        keywords = self._extract_technical_keywords(text, domain)
        keyword_score = self._calculate_keyword_relevance(keywords, domain)
        
        # 2. 技术深度评估
        depth_indicators = {
            'concept_usage': self._analyze_concept_usage(text, domain),
            'implementation_details': self._detect_implementation_details(text),
            'best_practices': self._identify_best_practices(text, domain),
            'problem_solving': self._evaluate_problem_solving_approach(text)
        }
        
        # 3. 技术准确性验证
        accuracy_score = self._verify_technical_accuracy(text, domain)
        
        return {
            'keyword_relevance': keyword_score,
            'technical_depth': depth_indicators,
            'accuracy_score': accuracy_score,
            'overall_technical_score': self._calculate_overall_technical_score(
                keyword_score, depth_indicators, accuracy_score
            )
        }
    
    def analyze_logical_structure(self, text: str) -> dict:
        """逻辑结构分析"""
        # 1. 论证结构识别
        argument_structure = self._identify_argument_structure(text)
        
        # 2. 逻辑连接词分析
        logical_connectors = self._analyze_logical_connectors(text)
        
        # 3. 因果关系识别
        causality_analysis = self._analyze_causality(text)
        
        # 4. 结论支撑度评估
        conclusion_support = self._evaluate_conclusion_support(text)
        
        return {
            'argument_structure': argument_structure,
            'logical_flow': logical_connectors,
            'causality_strength': causality_analysis,
            'conclusion_support': conclusion_support,
            'overall_logic_score': self._calculate_logic_score(
                argument_structure, logical_connectors, causality_analysis
            )
        }
    
    def analyze_innovation_indicators(self, text: str) -> dict:
        """创新思维指标分析"""
        # 1. 创新关键词识别
        innovation_keywords = self._identify_innovation_keywords(text)
        
        # 2. 解决方案创新性评估
        solution_novelty = self._evaluate_solution_novelty(text)
        
        # 3. 跨领域思维识别
        cross_domain_thinking = self._detect_cross_domain_thinking(text)
        
        # 4. 前瞻性思维评估
        forward_thinking = self._evaluate_forward_thinking(text)
        
        return {
            'innovation_keywords': innovation_keywords,
            'solution_novelty': solution_novelty,
            'cross_domain_thinking': cross_domain_thinking,
            'forward_thinking': forward_thinking,
            'innovation_score': self._calculate_innovation_score(
                innovation_keywords, solution_novelty, cross_domain_thinking
            )
        }
```

#### 1.1.2 语音分析算法
```python
class AdvancedAudioAnalyzer:
    """高级语音分析器"""
    
    def __init__(self):
        self.speech_recognizer = IflytekSpeechRecognizer()
        self.emotion_analyzer = EmotionAnalyzer()
        self.prosody_analyzer = ProsodyAnalyzer()
    
    def analyze_speech_quality(self, audio_path: str) -> dict:
        """语音质量综合分析"""
        # 1. 基础语音特征提取
        audio_features = self._extract_audio_features(audio_path)
        
        # 2. 语音清晰度分析
        clarity_score = self._analyze_speech_clarity(audio_features)
        
        # 3. 语速和节奏分析
        rhythm_analysis = self._analyze_speech_rhythm(audio_features)
        
        # 4. 音量稳定性分析
        volume_stability = self._analyze_volume_stability(audio_features)
        
        return {
            'clarity_score': clarity_score,
            'speech_rate': rhythm_analysis['rate'],
            'rhythm_stability': rhythm_analysis['stability'],
            'volume_stability': volume_stability,
            'overall_quality': self._calculate_speech_quality_score(
                clarity_score, rhythm_analysis, volume_stability
            )
        }
    
    def analyze_emotional_state(self, audio_path: str) -> dict:
        """情感状态分析"""
        # 1. 情感识别
        emotions = self.emotion_analyzer.analyze(audio_path)
        
        # 2. 情感稳定性评估
        emotional_stability = self._calculate_emotional_stability(emotions)
        
        # 3. 自信度评估
        confidence_level = self._assess_confidence_level(emotions, audio_path)
        
        # 4. 紧张度检测
        stress_level = self._detect_stress_level(emotions, audio_path)
        
        return {
            'primary_emotion': emotions['primary'],
            'emotion_intensity': emotions['intensity'],
            'emotional_stability': emotional_stability,
            'confidence_level': confidence_level,
            'stress_level': stress_level,
            'emotional_score': self._calculate_emotional_score(
                emotional_stability, confidence_level, stress_level
            )
        }
    
    def analyze_chinese_pronunciation(self, audio_path: str, text: str) -> dict:
        """中文发音分析"""
        # 1. 语音识别和对比
        recognized_text = self.speech_recognizer.recognize(audio_path)
        pronunciation_accuracy = self._compare_pronunciation(text, recognized_text)
        
        # 2. 声调准确性
        tone_accuracy = self._analyze_tone_accuracy(audio_path, text)
        
        # 3. 语音流畅度
        fluency_score = self._calculate_fluency_score(audio_path)
        
        return {
            'pronunciation_accuracy': pronunciation_accuracy,
            'tone_accuracy': tone_accuracy,
            'fluency_score': fluency_score,
            'overall_pronunciation': self._calculate_pronunciation_score(
                pronunciation_accuracy, tone_accuracy, fluency_score
            )
        }
```

#### 1.1.3 视频分析算法
```python
class AdvancedVideoAnalyzer:
    """高级视频分析器"""
    
    def __init__(self):
        self.face_detector = FaceDetector()
        self.emotion_recognizer = FacialEmotionRecognizer()
        self.pose_estimator = PoseEstimator()
        self.eye_tracker = EyeTracker()
    
    def analyze_facial_expressions(self, video_path: str) -> dict:
        """面部表情分析"""
        frames = self._extract_video_frames(video_path)
        expression_timeline = []
        
        for frame_idx, frame in enumerate(frames):
            faces = self.face_detector.detect(frame)
            if faces:
                # 表情识别
                emotions = self.emotion_recognizer.recognize(faces[0])
                
                # 微表情检测
                micro_expressions = self._detect_micro_expressions(
                    frame, faces[0], frame_idx
                )
                
                expression_timeline.append({
                    'timestamp': frame_idx / 30,  # 假设30fps
                    'emotions': emotions,
                    'micro_expressions': micro_expressions
                })
        
        # 表情稳定性分析
        expression_stability = self._analyze_expression_stability(expression_timeline)
        
        # 主导情绪识别
        dominant_emotion = self._identify_dominant_emotion(expression_timeline)
        
        return {
            'expression_timeline': expression_timeline,
            'expression_stability': expression_stability,
            'dominant_emotion': dominant_emotion,
            'emotional_consistency': self._calculate_emotional_consistency(
                expression_timeline
            )
        }
    
    def analyze_body_language(self, video_path: str) -> dict:
        """肢体语言分析"""
        frames = self._extract_video_frames(video_path)
        posture_timeline = []
        
        for frame_idx, frame in enumerate(frames):
            # 姿态估计
            pose = self.pose_estimator.estimate(frame)
            
            if pose:
                # 姿态分析
                posture_analysis = self._analyze_posture(pose)
                
                # 手势识别
                gestures = self._recognize_gestures(pose)
                
                posture_timeline.append({
                    'timestamp': frame_idx / 30,
                    'posture': posture_analysis,
                    'gestures': gestures
                })
        
        # 姿态稳定性
        posture_stability = self._analyze_posture_stability(posture_timeline)
        
        # 专业度评估
        professionalism_score = self._assess_professionalism(posture_timeline)
        
        return {
            'posture_timeline': posture_timeline,
            'posture_stability': posture_stability,
            'professionalism_score': professionalism_score,
            'body_language_score': self._calculate_body_language_score(
                posture_stability, professionalism_score
            )
        }
    
    def analyze_attention_level(self, video_path: str) -> dict:
        """注意力水平分析"""
        frames = self._extract_video_frames(video_path)
        attention_timeline = []
        
        for frame_idx, frame in enumerate(frames):
            faces = self.face_detector.detect(frame)
            if faces:
                # 眼神跟踪
                eye_gaze = self.eye_tracker.track(faces[0])
                
                # 注意力评估
                attention_score = self._calculate_attention_score(eye_gaze)
                
                # 分心检测
                distraction_level = self._detect_distraction(faces[0], frame)
                
                attention_timeline.append({
                    'timestamp': frame_idx / 30,
                    'eye_gaze': eye_gaze,
                    'attention_score': attention_score,
                    'distraction_level': distraction_level
                })
        
        # 整体注意力水平
        overall_attention = self._calculate_overall_attention(attention_timeline)
        
        # 注意力稳定性
        attention_stability = self._analyze_attention_stability(attention_timeline)
        
        return {
            'attention_timeline': attention_timeline,
            'overall_attention': overall_attention,
            'attention_stability': attention_stability,
            'eye_contact_quality': self._assess_eye_contact_quality(
                attention_timeline
            )
        }
```

### 1.2 多模态数据融合算法

#### 1.2.1 动态权重分配
```python
class DynamicWeightAllocator:
    """动态权重分配器"""
    
    def __init__(self):
        self.base_weights = {
            'text': 0.4,
            'audio': 0.35,
            'video': 0.25
        }
        self.quality_thresholds = {
            'high': 0.8,
            'medium': 0.5,
            'low': 0.3
        }
    
    def calculate_dynamic_weights(self, modality_qualities: dict) -> dict:
        """根据模态数据质量动态分配权重"""
        # 1. 评估各模态数据质量
        quality_scores = {}
        for modality, quality in modality_qualities.items():
            quality_scores[modality] = self._assess_data_quality(quality)
        
        # 2. 计算权重调整因子
        adjustment_factors = {}
        for modality, quality_score in quality_scores.items():
            if quality_score >= self.quality_thresholds['high']:
                adjustment_factors[modality] = 1.2  # 提升权重
            elif quality_score >= self.quality_thresholds['medium']:
                adjustment_factors[modality] = 1.0  # 保持权重
            else:
                adjustment_factors[modality] = 0.7  # 降低权重
        
        # 3. 计算调整后权重
        adjusted_weights = {}
        total_adjusted_weight = 0
        
        for modality, base_weight in self.base_weights.items():
            if modality in adjustment_factors:
                adjusted_weight = base_weight * adjustment_factors[modality]
                adjusted_weights[modality] = adjusted_weight
                total_adjusted_weight += adjusted_weight
        
        # 4. 归一化权重
        normalized_weights = {}
        for modality, weight in adjusted_weights.items():
            normalized_weights[modality] = weight / total_adjusted_weight
        
        return normalized_weights
    
    def _assess_data_quality(self, quality_metrics: dict) -> float:
        """评估单个模态的数据质量"""
        # 根据具体的质量指标计算综合质量分数
        quality_indicators = [
            quality_metrics.get('clarity', 0.5),
            quality_metrics.get('completeness', 0.5),
            quality_metrics.get('reliability', 0.5)
        ]
        return sum(quality_indicators) / len(quality_indicators)
```

#### 1.2.2 多模态特征融合
```python
class MultimodalFeatureFusion:
    """多模态特征融合器"""
    
    def __init__(self):
        self.fusion_strategies = {
            'early_fusion': self._early_fusion,
            'late_fusion': self._late_fusion,
            'hybrid_fusion': self._hybrid_fusion
        }
    
    def fuse_multimodal_features(self, 
                                text_features: dict,
                                audio_features: dict,
                                video_features: dict,
                                weights: dict) -> dict:
        """融合多模态特征"""
        
        # 1. 特征标准化
        normalized_features = {
            'text': self._normalize_features(text_features),
            'audio': self._normalize_features(audio_features),
            'video': self._normalize_features(video_features)
        }
        
        # 2. 特征对齐
        aligned_features = self._align_features(normalized_features)
        
        # 3. 加权融合
        fused_features = self._weighted_fusion(aligned_features, weights)
        
        # 4. 特征增强
        enhanced_features = self._enhance_features(fused_features)
        
        return enhanced_features
    
    def _weighted_fusion(self, features: dict, weights: dict) -> dict:
        """加权特征融合"""
        fused_result = {}
        
        # 技术能力融合
        technical_scores = []
        for modality, weight in weights.items():
            if modality in features and 'technical_score' in features[modality]:
                technical_scores.append(
                    features[modality]['technical_score'] * weight
                )
        fused_result['technical_competency'] = sum(technical_scores)
        
        # 沟通能力融合
        communication_scores = []
        for modality, weight in weights.items():
            if modality in features and 'communication_score' in features[modality]:
                communication_scores.append(
                    features[modality]['communication_score'] * weight
                )
        fused_result['communication_skills'] = sum(communication_scores)
        
        # 情感状态融合
        emotional_scores = []
        for modality, weight in weights.items():
            if modality in features and 'emotional_score' in features[modality]:
                emotional_scores.append(
                    features[modality]['emotional_score'] * weight
                )
        fused_result['emotional_stability'] = sum(emotional_scores)
        
        return fused_result
```

### 1.3 智能评估算法

#### 1.3.1 六维能力评估详细算法
```python
class SixDimensionalCapabilityEvaluator:
    """六维能力评估器"""
    
    def __init__(self):
        self.capability_weights = {
            "professional_knowledge": 0.25,
            "skill_matching": 0.20,
            "language_expression": 0.15,
            "logical_thinking": 0.15,
            "innovation_ability": 0.15,
            "stress_resistance": 0.10
        }
        self.domain_expertise = DomainExpertiseEvaluator()
        self.skill_matcher = SkillMatcher()
    
    def evaluate_professional_knowledge(self, 
                                      text_analysis: dict,
                                      domain: str,
                                      position: str) -> float:
        """专业知识水平评估 (25%权重)"""
        
        # 1. 技术概念掌握度 (40%)
        concept_mastery = self._evaluate_concept_mastery(
            text_analysis['technical_keywords'], domain
        )
        
        # 2. 技术深度 (30%)
        technical_depth = self._evaluate_technical_depth(
            text_analysis['technical_depth'], domain
        )
        
        # 3. 实践经验体现 (20%)
        practical_experience = self._evaluate_practical_experience(
            text_analysis['implementation_details']
        )
        
        # 4. 知识广度 (10%)
        knowledge_breadth = self._evaluate_knowledge_breadth(
            text_analysis['cross_domain_references'], domain
        )
        
        # 加权计算
        professional_score = (
            concept_mastery * 0.4 +
            technical_depth * 0.3 +
            practical_experience * 0.2 +
            knowledge_breadth * 0.1
        )
        
        return min(1.0, max(0.0, professional_score))
    
    def evaluate_skill_matching(self,
                               text_analysis: dict,
                               audio_analysis: dict,
                               position: str) -> float:
        """技能匹配度评估 (20%权重)"""
        
        # 1. 获取岗位技能要求
        required_skills = self.skill_matcher.get_position_requirements(position)
        
        # 2. 技术技能匹配 (60%)
        technical_match = self._calculate_technical_skill_match(
            text_analysis['technical_keywords'], required_skills['technical']
        )
        
        # 3. 软技能匹配 (25%)
        soft_skill_match = self._calculate_soft_skill_match(
            audio_analysis['communication_indicators'], required_skills['soft']
        )
        
        # 4. 经验匹配 (15%)
        experience_match = self._calculate_experience_match(
            text_analysis['experience_indicators'], required_skills['experience']
        )
        
        # 加权计算
        skill_matching_score = (
            technical_match * 0.6 +
            soft_skill_match * 0.25 +
            experience_match * 0.15
        )
        
        return min(1.0, max(0.0, skill_matching_score))
    
    def evaluate_language_expression(self,
                                   text_analysis: dict,
                                   audio_analysis: dict) -> float:
        """语言表达能力评估 (15%权重)"""
        
        # 1. 中文表达清晰度 (40%)
        chinese_clarity = self._evaluate_chinese_expression_clarity(
            text_analysis['expression_clarity'],
            audio_analysis['pronunciation_accuracy']
        )
        
        # 2. 逻辑表达能力 (30%)
        logical_expression = self._evaluate_logical_expression(
            text_analysis['logical_structure']
        )
        
        # 3. 专业术语使用 (20%)
        terminology_usage = self._evaluate_terminology_usage(
            text_analysis['technical_keywords']
        )
        
        # 4. 语音表达质量 (10%)
        speech_quality = self._evaluate_speech_expression_quality(
            audio_analysis['speech_quality']
        )
        
        # 加权计算
        language_score = (
            chinese_clarity * 0.4 +
            logical_expression * 0.3 +
            terminology_usage * 0.2 +
            speech_quality * 0.1
        )
        
        return min(1.0, max(0.0, language_score))
    
    def evaluate_logical_thinking(self, text_analysis: dict) -> float:
        """逻辑思维能力评估 (15%权重)"""
        
        # 1. 问题分析能力 (35%)
        problem_analysis = self._evaluate_problem_analysis_ability(
            text_analysis['problem_decomposition']
        )
        
        # 2. 解决方案逻辑性 (30%)
        solution_logic = self._evaluate_solution_logic(
            text_analysis['solution_structure']
        )
        
        # 3. 因果关系理解 (25%)
        causality_understanding = self._evaluate_causality_understanding(
            text_analysis['causality_analysis']
        )
        
        # 4. 逻辑连贯性 (10%)
        logical_coherence = self._evaluate_logical_coherence(
            text_analysis['logical_flow']
        )
        
        # 加权计算
        logical_score = (
            problem_analysis * 0.35 +
            solution_logic * 0.3 +
            causality_understanding * 0.25 +
            logical_coherence * 0.1
        )
        
        return min(1.0, max(0.0, logical_score))
    
    def evaluate_innovation_ability(self, text_analysis: dict) -> float:
        """创新能力评估 (15%权重)"""
        
        # 1. 创新思维体现 (40%)
        innovative_thinking = self._evaluate_innovative_thinking(
            text_analysis['innovation_indicators']
        )
        
        # 2. 解决方案创新性 (35%)
        solution_novelty = self._evaluate_solution_innovation(
            text_analysis['solution_novelty']
        )
        
        # 3. 技术前瞻性 (25%)
        technical_foresight = self._evaluate_technical_foresight(
            text_analysis['forward_thinking']
        )
        
        # 加权计算
        innovation_score = (
            innovative_thinking * 0.4 +
            solution_novelty * 0.35 +
            technical_foresight * 0.25
        )
        
        return min(1.0, max(0.0, innovation_score))
    
    def evaluate_stress_resistance(self,
                                 audio_analysis: dict,
                                 video_analysis: dict) -> float:
        """应变抗压能力评估 (10%权重)"""
        
        # 1. 情绪稳定性 (50%)
        emotional_stability = self._evaluate_emotional_stability(
            audio_analysis['emotional_stability'],
            video_analysis['expression_stability']
        )
        
        # 2. 压力应对能力 (30%)
        stress_handling = self._evaluate_stress_handling(
            audio_analysis['stress_level'],
            video_analysis['stress_indicators']
        )
        
        # 3. 自信度表现 (20%)
        confidence_display = self._evaluate_confidence_display(
            audio_analysis['confidence_level'],
            video_analysis['body_language_confidence']
        )
        
        # 加权计算
        stress_resistance_score = (
            emotional_stability * 0.5 +
            stress_handling * 0.3 +
            confidence_display * 0.2
        )
        
        return min(1.0, max(0.0, stress_resistance_score))
```

### 1.4 个性化学习路径生成算法

#### 1.4.1 学习路径推荐引擎
```python
class PersonalizedLearningPathGenerator:
    """个性化学习路径生成器"""
    
    def __init__(self):
        self.learning_resources = LearningResourceDatabase()
        self.skill_gap_analyzer = SkillGapAnalyzer()
        self.learning_style_predictor = LearningStylePredictor()
    
    def generate_learning_path(self,
                             capability_scores: dict,
                             user_profile: dict,
                             target_position: str) -> dict:
        """生成个性化学习路径"""
        
        # 1. 技能差距分析
        skill_gaps = self.skill_gap_analyzer.analyze_gaps(
            capability_scores, target_position
        )
        
        # 2. 学习优先级排序
        learning_priorities = self._prioritize_learning_areas(
            skill_gaps, capability_scores
        )
        
        # 3. 学习风格预测
        learning_style = self.learning_style_predictor.predict(user_profile)
        
        # 4. 生成分阶段学习计划
        learning_phases = self._generate_learning_phases(
            learning_priorities, learning_style
        )
        
        # 5. 资源推荐
        recommended_resources = self._recommend_learning_resources(
            learning_phases, learning_style
        )
        
        return {
            'skill_gaps': skill_gaps,
            'learning_priorities': learning_priorities,
            'learning_style': learning_style,
            'learning_phases': learning_phases,
            'recommended_resources': recommended_resources,
            'estimated_timeline': self._calculate_learning_timeline(learning_phases)
        }
    
    def _prioritize_learning_areas(self,
                                 skill_gaps: dict,
                                 current_scores: dict) -> list:
        """学习领域优先级排序"""
        priorities = []
        
        for skill, gap_info in skill_gaps.items():
            # 计算优先级分数
            urgency = 1.0 - current_scores.get(skill, 0.5)  # 当前水平越低越紧急
            importance = gap_info['importance']  # 技能重要性
            difficulty = gap_info['learning_difficulty']  # 学习难度
            
            priority_score = (urgency * 0.4 + importance * 0.4 - difficulty * 0.2)
            
            priorities.append({
                'skill': skill,
                'priority_score': priority_score,
                'gap_size': gap_info['gap_size'],
                'learning_difficulty': difficulty
            })
        
        # 按优先级分数排序
        return sorted(priorities, key=lambda x: x['priority_score'], reverse=True)
    
    def _generate_learning_phases(self,
                                priorities: list,
                                learning_style: dict) -> dict:
        """生成分阶段学习计划"""
        phases = {
            'short_term': {  # 1-3个月
                'duration': '1-3个月',
                'focus': '基础技能补强',
                'modules': []
            },
            'medium_term': {  # 3-6个月
                'duration': '3-6个月',
                'focus': '核心能力提升',
                'modules': []
            },
            'long_term': {  # 6-12个月
                'duration': '6-12个月',
                'focus': '高级技能发展',
                'modules': []
            }
        }
        
        # 根据优先级和学习风格分配学习模块
        for i, priority in enumerate(priorities):
            if i < 3:  # 前3个高优先级技能
                phase = 'short_term'
            elif i < 6:  # 中等优先级技能
                phase = 'medium_term'
            else:  # 低优先级技能
                phase = 'long_term'
            
            learning_module = self._create_learning_module(
                priority, learning_style
            )
            phases[phase]['modules'].append(learning_module)
        
        return phases
```

---

## 🎯 2. 数据库详细设计

### 2.1 数据表详细结构

#### 2.1.1 扩展用户表设计
```sql
-- 用户详细信息表
CREATE TABLE user_detailed_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    
    -- 教育背景
    education_level VARCHAR(50),  -- 本科、硕士、博士
    university VARCHAR(100),
    major VARCHAR(100),
    graduation_year INTEGER,
    gpa DECIMAL(3,2),
    
    -- 技能档案
    programming_languages JSON,  -- ["Python", "Java", "JavaScript"]
    frameworks JSON,            -- ["Vue.js", "React", "Django"]
    databases JSON,             -- ["MySQL", "MongoDB", "Redis"]
    tools JSON,                 -- ["Git", "Docker", "Kubernetes"]
    
    -- 项目经验
    project_count INTEGER DEFAULT 0,
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    
    -- 职业目标
    target_positions JSON,      -- ["AI工程师", "数据科学家"]
    target_companies JSON,      -- ["阿里巴巴", "腾讯", "字节跳动"]
    expected_salary_range VARCHAR(50),
    
    -- 学习偏好
    preferred_learning_style VARCHAR(50), -- visual, auditory, kinesthetic
    study_time_preference VARCHAR(50),    -- morning, afternoon, evening
    learning_pace VARCHAR(50),            -- fast, medium, slow
    
    -- 面试历史
    total_interviews INTEGER DEFAULT 0,
    successful_interviews INTEGER DEFAULT 0,
    average_score DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 用户技能评估历史表
CREATE TABLE user_skill_assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    assessment_date DATE NOT NULL,
    
    -- 六维能力得分
    professional_knowledge DECIMAL(3,2),
    skill_matching DECIMAL(3,2),
    language_expression DECIMAL(3,2),
    logical_thinking DECIMAL(3,2),
    innovation_ability DECIMAL(3,2),
    stress_resistance DECIMAL(3,2),
    overall_score DECIMAL(3,2),
    
    -- 技能标签
    technical_skills JSON,
    soft_skills JSON,
    improvement_areas JSON,
    
    -- 评估来源
    assessment_source VARCHAR(50), -- interview, self_assessment, peer_review
    session_id INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE SET NULL
);
```

#### 2.1.2 面试问题库详细设计
```sql
-- 面试问题详细表
CREATE TABLE interview_questions_detailed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- 基本信息
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- technical, behavioral, scenario, coding
    domain VARCHAR(50) NOT NULL,
    subdomain VARCHAR(100),             -- 子领域，如"机器学习"下的"深度学习"
    
    -- 难度和分类
    difficulty_level VARCHAR(20) NOT NULL, -- 初级、中级、高级、专家级
    complexity_score INTEGER,              -- 1-10复杂度评分
    estimated_time INTEGER,                -- 预期回答时间（分钟）
    
    -- 岗位相关性
    target_positions JSON,                 -- 适用岗位列表
    experience_level VARCHAR(50),          -- 应届生、1-3年、3-5年、5年以上
    
    -- 评分标准
    scoring_criteria JSON,                 -- 详细评分标准
    expected_keywords JSON,                -- 期望关键词
    bonus_keywords JSON,                   -- 加分关键词
    negative_keywords JSON,                -- 扣分关键词
    
    -- 参考答案
    sample_answer TEXT,                    -- 参考答案
    answer_key_points JSON,                -- 答案要点
    common_mistakes JSON,                  -- 常见错误
    
    -- 后续问题
    follow_up_questions JSON,              -- 后续深入问题
    related_questions JSON,                -- 相关问题ID列表
    
    -- 统计信息
    usage_count INTEGER DEFAULT 0,        -- 使用次数
    average_score DECIMAL(3,2),           -- 平均得分
    pass_rate DECIMAL(3,2),               -- 通过率
    
    -- 元数据
    created_by VARCHAR(100),
    reviewed_by VARCHAR(100),
    review_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    tags JSON,                            -- 标签
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 问题难度调节记录表
CREATE TABLE question_difficulty_adjustments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    
    -- 调节信息
    original_difficulty VARCHAR(20),
    adjusted_difficulty VARCHAR(20),
    adjustment_reason TEXT,
    
    -- 用户表现
    user_performance_score DECIMAL(3,2),
    response_time INTEGER,                 -- 实际回答时间
    confidence_level DECIMAL(3,2),
    
    -- 调节效果
    adjustment_effectiveness DECIMAL(3,2), -- 调节效果评估
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES interview_questions_detailed(id) ON DELETE CASCADE
);
```

#### 2.1.3 多模态分析结果详细表
```sql
-- 多模态分析详细结果表
CREATE TABLE multimodal_analysis_detailed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    analysis_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 原始数据
    user_text_response TEXT,
    audio_file_path VARCHAR(255),
    video_file_path VARCHAR(255),
    response_duration INTEGER,             -- 回答时长（秒）
    
    -- 文本分析结果
    text_analysis_result JSON,             -- 详细文本分析结果
    technical_keywords_found JSON,         -- 识别到的技术关键词
    logical_structure_score DECIMAL(3,2),  -- 逻辑结构得分
    expression_clarity_score DECIMAL(3,2), -- 表达清晰度得分
    innovation_indicators JSON,            -- 创新思维指标
    
    -- 语音分析结果
    audio_analysis_result JSON,            -- 详细语音分析结果
    speech_clarity_score DECIMAL(3,2),     -- 语音清晰度
    emotion_stability_score DECIMAL(3,2),  -- 情绪稳定性
    confidence_level_score DECIMAL(3,2),   -- 自信度
    pronunciation_accuracy DECIMAL(3,2),   -- 发音准确度
    speech_rate DECIMAL(5,2),              -- 语速（字/分钟）
    
    -- 视频分析结果
    video_analysis_result JSON,            -- 详细视频分析结果
    facial_expression_timeline JSON,       -- 表情变化时间线
    body_language_score DECIMAL(3,2),      -- 肢体语言得分
    attention_level_score DECIMAL(3,2),    -- 注意力水平
    eye_contact_quality DECIMAL(3,2),      -- 眼神交流质量
    professionalism_score DECIMAL(3,2),    -- 专业度评分
    
    -- 融合分析结果
    multimodal_fusion_result JSON,         -- 多模态融合结果
    data_quality_scores JSON,              -- 各模态数据质量评分
    dynamic_weights JSON,                  -- 动态权重分配
    
    -- 能力维度得分
    professional_knowledge_score DECIMAL(3,2),
    skill_matching_score DECIMAL(3,2),
    language_expression_score DECIMAL(3,2),
    logical_thinking_score DECIMAL(3,2),
    innovation_ability_score DECIMAL(3,2),
    stress_resistance_score DECIMAL(3,2),
    
    -- 综合评估
    overall_performance_score DECIMAL(3,2),
    performance_level VARCHAR(50),         -- 优秀、良好、一般、需改进
    
    -- 处理状态
    processing_status VARCHAR(20) DEFAULT 'completed', -- processing, completed, failed
    error_message TEXT,
    
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES interview_questions_detailed(id) ON DELETE CASCADE
);
```

### 2.2 索引和性能优化

#### 2.2.1 关键索引设计
```sql
-- 用户相关索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_profiles_user_id ON user_detailed_profiles(user_id);

-- 面试会话索引
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_domain ON interview_sessions(domain);
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);
CREATE INDEX idx_interview_sessions_date ON interview_sessions(start_time);

-- 问题库索引
CREATE INDEX idx_questions_domain_difficulty ON interview_questions_detailed(domain, difficulty_level);
CREATE INDEX idx_questions_type ON interview_questions_detailed(question_type);
CREATE INDEX idx_questions_positions ON interview_questions_detailed(target_positions);

-- 分析结果索引
CREATE INDEX idx_multimodal_session_id ON multimodal_analysis_detailed(session_id);
CREATE INDEX idx_multimodal_question_id ON multimodal_analysis_detailed(question_id);
CREATE INDEX idx_multimodal_timestamp ON multimodal_analysis_detailed(analysis_timestamp);

-- 复合索引
CREATE INDEX idx_session_question_analysis ON multimodal_analysis_detailed(session_id, question_id);
CREATE INDEX idx_user_domain_performance ON interview_sessions(user_id, domain, start_time);
```

#### 2.2.2 数据分区策略
```sql
-- 按时间分区的分析结果表（适用于大数据量场景）
CREATE TABLE multimodal_analysis_2025_q1 (
    CHECK (analysis_timestamp >= '2025-01-01' AND analysis_timestamp < '2025-04-01')
) INHERITS (multimodal_analysis_detailed);

CREATE TABLE multimodal_analysis_2025_q2 (
    CHECK (analysis_timestamp >= '2025-04-01' AND analysis_timestamp < '2025-07-01')
) INHERITS (multimodal_analysis_detailed);

-- 自动分区规则
CREATE OR REPLACE FUNCTION multimodal_analysis_insert_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.analysis_timestamp >= '2025-01-01' AND NEW.analysis_timestamp < '2025-04-01' THEN
        INSERT INTO multimodal_analysis_2025_q1 VALUES (NEW.*);
    ELSIF NEW.analysis_timestamp >= '2025-04-01' AND NEW.analysis_timestamp < '2025-07-01' THEN
        INSERT INTO multimodal_analysis_2025_q2 VALUES (NEW.*);
    ELSE
        RAISE EXCEPTION 'Date out of range. Fix the multimodal_analysis_insert_trigger() function!';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## 🎯 总结

本详细设计说明书深入描述了iFlytek多模态智能面试评测系统的核心算法、数据库设计和技术实现细节。系统采用先进的多模态分析技术和智能评估算法，为高校学生提供专业、准确、个性化的面试训练服务。通过科学的六维能力评估体系和动态学习路径生成，帮助学生全面提升面试技能和就业竞争力。
