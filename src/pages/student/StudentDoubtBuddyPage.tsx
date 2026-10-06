import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useVoiceInput, useTextToSpeech } from '../../hooks/useVoiceInput';
import {
  aiDoubtBuddyService,
  type AIConversation,
  type AIMessage,
  type InputType,
  type ConversationMode,
  type SourceType,
  type StudentAIContext,
} from '../../services/aiDoubtBuddyService';

import {
  Sparkles, Send, Mic, MicOff, Image, FileText, Plus, Trash2,
  BookOpen, Lightbulb, HelpCircle, AlignLeft, Layers,
  MessageCircle, Volume2, VolumeX, ChevronLeft, X, Loader2,
  AlertCircle, CheckCircle, School, User, Copy, RotateCcw,
} from 'lucide-react';

// ─── Quick Action Modes ────────────────────────────────────────────────────────
const QUICK_MODES: { label: string; mode: ConversationMode; icon: React.ReactNode; color: string }[] = [
  { label: 'Explain Simply', mode: 'explain_simply', icon: <Lightbulb className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { label: 'Step-by-Step', mode: 'step_by_step', icon: <Layers className="w-3.5 h-3.5" />, color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { label: 'Give Me a Hint', mode: 'hint', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { label: 'Summarize', mode: 'summarize', icon: <AlignLeft className="w-3.5 h-3.5" />, color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
  { label: 'Give an Example', mode: 'example', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
  { label: 'Quiz Me', mode: 'quiz_me', icon: <School className="w-3.5 h-3.5" />, color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
];

const SOURCE_LABELS: Record<SourceType, { label: string; icon: string; className: string }> = {
  SRI_SAI_MATERIAL: { label: '📚 Based on SRI SAI Study Material', icon: '📚', className: 'bg-[#F0F5F3] text-[#173F35] border-[#C3D9D3]' },
  CURRICULUM: { label: '📖 Curriculum Reference', icon: '📖', className: 'bg-blue-50 text-blue-800 border-blue-200' },
  GENERAL_AI: { label: '💡 General Explanation', icon: '💡', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  WEB: { label: '🌐 Web Reference', icon: '🌐', className: 'bg-gray-50 text-gray-700 border-gray-200' },
};

// ─── Simple Markdown Renderer ──────────────────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-sm font-bold text-[#173F35] mt-3 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-base font-bold text-[#173F35] mt-4 mb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-lg font-bold text-[#173F35] mt-4 mb-2">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-4 text-sm leading-relaxed list-disc">
          {formatInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-4 text-sm leading-relaxed list-decimal">
          {formatInline(line.replace(/^\d+\.\s/, ''))}
        </li>
      );
    } else if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-[#1A1A2E] text-green-300 text-xs rounded-lg p-3 my-2 overflow-x-auto font-mono">
          {codeLines.join('\n')}
        </pre>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(<p key={i} className="text-sm leading-relaxed">{formatInline(line)}</p>);
    }
    i++;
  }
  return <div className="space-y-0.5">{elements}</div>;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-[#173F35]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="bg-stone-100 text-[#B85C45] px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// ─── Loading Indicator ─────────────────────────────────────────────────────────
function ThinkingBubble({ inputType }: { inputType: InputType }) {
  const messages: Record<InputType, string> = {
    text: 'Thinking through this... 🤔',
    image: 'Reading your question... 📷',
    voice: 'Processing your question... 🎙️',
    document: 'Reading the document... 📄',
  };
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-[#C99A3D]" />
      </div>
      <div className="bg-white border border-[#EDE6D8] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[80%]">
        <p className="text-xs text-stone-500 italic animate-pulse">{messages[inputType]}</p>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#C99A3D] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({
  message,
  onSpeak,
  isSpeaking,
  onAskTeacher,
}: {
  message: AIMessage;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  onAskTeacher: (msg: AIMessage) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const srcMeta = message.sourceType ? SOURCE_LABELS[message.sourceType] : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end">
        <div className="bg-gradient-to-br from-[#173F35] to-[#2E6B57] text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-[80%]">
          {message.attachmentUrl && (
            <div className="mb-2">
              {message.attachmentType === 'image' ? (
                <img src={message.attachmentUrl} alt="Attached" className="rounded-lg max-w-[200px] max-h-[150px] object-cover" />
              ) : (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-xs">
                  <FileText className="w-4 h-4" />
                  <span>{message.attachmentName ?? 'Attachment'}</span>
                </div>
              )}
            </div>
          )}
          <p className="text-sm leading-relaxed">{message.content}</p>
          {message.mode && message.mode !== 'normal' && (
            <span className="inline-block mt-1 text-xs bg-white/20 text-white/80 px-2 py-0.5 rounded-full">
              {QUICK_MODES.find(m => m.mode === message.mode)?.label ?? message.mode}
            </span>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-[#C99A3D] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-[#C99A3D]" />
      </div>
      <div className="flex-1 max-w-[85%] space-y-2">
        {/* Source label */}
        {srcMeta && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${srcMeta.className}`}>
            {srcMeta.label}
          </span>
        )}

        {/* AI Message bubble */}
        <div className="bg-white border border-[#EDE6D8] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
          <div className="prose prose-sm max-w-none text-stone-700">
            {renderMarkdown(message.content)}
          </div>

          {/* Source citations */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#EDE6D8] space-y-1.5">
              <p className="text-xs font-semibold text-[#173F35] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Sources:
              </p>
              {message.sources.map((src, idx) => (
                <div key={idx} className="text-xs bg-[#F7F3EA] border border-[#E6DDCF] rounded-lg px-3 py-1.5">
                  <span className="font-semibold text-[#173F35]">{src.title}</span>
                  {src.subject && <span className="text-stone-500"> — {src.subject}</span>}
                  {src.chapter && <span className="text-stone-400"> / {src.chapter}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Action bar */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-[#173F35] transition-colors"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => onSpeak(message.content)}
              className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-[#173F35] transition-colors"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isSpeaking ? 'Stop' : 'Listen'}
            </button>
            <button
              onClick={() => onAskTeacher(message)}
              className="inline-flex items-center gap-1 text-xs text-[#B85C45] hover:text-[#9B3D2A] transition-colors ml-auto"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Still confused? Ask My Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────
export const StudentDoubtBuddyPage: React.FC = () => {
  const { currentStudent } = useAuth();
  const location = useLocation();
  const passedContext = (location.state as any) ?? {};

  // Context from student profile
  const studentCtx: StudentAIContext = {
    name: currentStudent.name,
    className: currentStudent.grade,
    board: currentStudent.board,
    subject: passedContext.subject ?? '',
    chapter: passedContext.chapter ?? '',
  };

  // State
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState<ConversationMode>('normal');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingInputType, setThinkingInputType] = useState<InputType>('text');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingFilePreview, setPendingFilePreview] = useState<string | null>(null);
  const [pendingFileType, setPendingFileType] = useState<InputType>('image');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerConfigured, setProviderConfigured] = useState<boolean | null>(null);

  // TTS / STT
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  const { isListening, transcript, interimTranscript, startListening, stopListening, clearTranscript, isSupported: voiceSupported, error: voiceError } = useVoiceInput();
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Populate textarea with transcript
  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Load conversations on mount
  useEffect(() => {
    aiDoubtBuddyService.getConversations().then(setConversations);
  }, []);

  // Pre-fill context from navigation state
  useEffect(() => {
    if (passedContext.subject) setInputText(prev => prev || '');
  }, []);

  const handleNewConversation = async () => {
    setActiveConvId(null);
    setMessages([]);
    setInputText('');
    setError(null);
    setPendingFile(null);
    setPendingFilePreview(null);
    setSidebarOpen(false);
  };

  const handleSelectConversation = async (convId: string) => {
    setActiveConvId(convId);
    setSidebarOpen(false);
    const msgs = await aiDoubtBuddyService.getMessages(convId);
    setMessages(msgs);
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await aiDoubtBuddyService.deleteConversation(convId);
    const updated = await aiDoubtBuddyService.getConversations();
    setConversations(updated);
    if (activeConvId === convId) {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum 10 MB allowed.');
      return;
    }
    setPendingFile(file);
    const isImg = file.type.startsWith('image/');
    setPendingFileType(isImg ? 'image' : 'document');
    if (isImg) {
      const url = URL.createObjectURL(file);
      setPendingFilePreview(url);
    } else {
      setPendingFilePreview(null);
    }
    e.target.value = '';
  };

  const clearPendingFile = () => {
    setPendingFile(null);
    setPendingFilePreview(null);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text && !pendingFile) return;
    if (isThinking) return;

    setError(null);

    // Determine input type
    let inputType: InputType = 'text';
    if (pendingFile) {
      if (pendingFile.type.startsWith('image/')) inputType = 'image';
      else if (pendingFile.type === 'application/pdf') inputType = 'document';
      else if (pendingFile.type.startsWith('audio/')) inputType = 'voice';
      else inputType = 'document';
    }

    // Create conversation if needed
    let convId = activeConvId;
    if (!convId) {
      const created = await aiDoubtBuddyService.createConversation(studentCtx);
      if (!created) {
        setError('Could not create a new conversation. Please try again.');
        return;
      }
      convId = created.id;
      setActiveConvId(convId);
    }

    // Build user message
    let attachmentUrl: string | undefined;
    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;

    if (pendingFile && inputType === 'image') {
      try {
        imageBase64 = await aiDoubtBuddyService.fileToBase64(pendingFile);
        imageMimeType = pendingFile.type;
        attachmentUrl = pendingFilePreview ?? URL.createObjectURL(pendingFile);
      } catch {
        setError('Could not process the image. Please try again.');
        return;
      }
    } else if (pendingFile) {
      // Upload non-image files
      const { data: { user } } = await (await import('../../lib/supabase')).supabase.auth.getUser();
      if (user) {
        const { url } = await aiDoubtBuddyService.uploadAttachment(pendingFile, convId, user.id);
        attachmentUrl = url ?? undefined;
      }
    }

    const userMsgDisplay: AIMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: text || `📎 ${pendingFile?.name ?? 'Attachment'}`,
      inputType,
      mode: activeMode,
      sourceType: 'GENERAL_AI',
      attachmentUrl,
      attachmentType: pendingFile ? pendingFileType : undefined,
      attachmentName: pendingFile?.name,
      createdAt: new Date().toISOString(),
    };

    const historyForAI = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    setMessages(prev => [...prev, userMsgDisplay]);
    setInputText('');
    clearTranscript();
    setPendingFile(null);
    setPendingFilePreview(null);
    setIsThinking(true);
    setThinkingInputType(inputType);

    // Auto-title conversation on first message
    if (messages.length === 0 && text) {
      aiDoubtBuddyService.autoTitleConversation(convId, text);
    }

    // Call AI
    const result = await aiDoubtBuddyService.askDoubtBuddy({
      conversationId: convId,
      userMessage: text || `[Student uploaded a ${inputType}: ${pendingFile?.name}]`,
      inputType,
      mode: activeMode,
      imageBase64,
      imageMimeType,
      studentContext: studentCtx,
      historyMessages: historyForAI,
    });

    setIsThinking(false);
    setProviderConfigured(result.providerConfigured);

    const asstMsg: AIMessage = {
      id: `local-asst-${Date.now()}`,
      role: 'assistant',
      content: result.reply,
      inputType: 'text',
      mode: activeMode,
      sourceType: result.sourceType,
      sources: result.sources,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, asstMsg]);

    // Persist to Supabase
    await aiDoubtBuddyService.saveMessage(convId, 'user', userMsgDisplay.content, inputType, activeMode, 'GENERAL_AI', []);
    await aiDoubtBuddyService.saveMessage(convId, 'assistant', result.reply, 'text', activeMode, result.sourceType, result.sources, result.model);

    // Refresh conversation list
    aiDoubtBuddyService.getConversations().then(setConversations);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeak = (content: string, msgId: string) => {
    if (isSpeaking && speakingMessageId === msgId) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      stopSpeaking();
      speak(content);
      setSpeakingMessageId(msgId);
    }
  };

  const handleAskTeacher = async (msg: AIMessage) => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;

    const result = await aiDoubtBuddyService.escalateToTeacher({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      subject: studentCtx.subject ?? 'General',
      className: studentCtx.className ?? '',
      userQuestion: lastUserMsg.content,
      aiReply: msg.content,
      attachmentUrl: lastUserMsg.attachmentUrl,
      conversationId: activeConvId ?? undefined,
    });

    if (result.success) {
      setError(null);
      const confirmMsg: AIMessage = {
        id: `local-confirm-${Date.now()}`,
        role: 'assistant',
        content: '✅ **Doubt sent to your teacher!** They will review your question and the AI explanation and get back to you through the Doubts section. You can also check updates in **Ask a Doubt** in the sidebar.',
        inputType: 'text',
        mode: 'normal',
        sourceType: 'GENERAL_AI',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, confirmMsg]);
    } else {
      setError('Could not send doubt to teacher. Please try again.');
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  const handleQuickMode = (mode: ConversationMode) => {
    setActiveMode(prev => prev === mode ? 'normal' : mode);
  };

  const isEmptyState = !activeConvId && messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FFFDF8] -m-4 sm:-m-6 lg:-m-8">
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-[#EDE6D8] flex flex-col
        transform transition-transform duration-300
        lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-[#EDE6D8] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C99A3D]" />
          </div>
          <div>
            <h2 className="text-sm font-serif font-bold text-[#173F35]">Doubt Buddy</h2>
            <p className="text-[10px] text-stone-500">Conversation History</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-1 rounded hover:bg-stone-100">
            <ChevronLeft className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* New conversation button */}
        <div className="p-3">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#173F35] to-[#2E6B57] text-white text-sm font-semibold hover:from-[#0E2822] hover:to-[#173F35] transition-all"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-stone-400 text-center mt-8 px-4">
              Your conversations will appear here.
            </p>
          )}
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start justify-between gap-2 group transition-all ${
                activeConvId === conv.id
                  ? 'bg-[#F0F5F3] border border-[#C3D9D3]'
                  : 'hover:bg-stone-50 border border-transparent'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#173F35] truncate">{conv.title}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {new Date(conv.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <button
                onClick={e => handleDeleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 text-red-400 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>

        {/* Student context strip */}
        <div className="p-3 border-t border-[#EDE6D8]">
          <div className="bg-[#F7F3EA] rounded-xl px-3 py-2 space-y-0.5">
            <p className="text-[10px] font-semibold text-[#173F35] uppercase tracking-wide">Your Context</p>
            <p className="text-xs text-stone-600 font-medium">{currentStudent.name}</p>
            <p className="text-xs text-stone-500">{studentCtx.className} • {studentCtx.board}</p>
            {studentCtx.subject && <p className="text-xs text-[#2E6B57] font-medium">{studentCtx.subject}</p>}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Chat Area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#EDE6D8] bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-500"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#C99A3D]" />
            </div>
            <div>
              <h1 className="text-sm font-serif font-bold text-[#173F35]">✨ Doubt Buddy</h1>
              <p className="text-[10px] text-stone-500 hidden sm:block">Ask anything — I'll help you understand it</p>
            </div>
          </div>

          {/* Provider status */}
          {providerConfigured === false && (
            <div className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-amber-700 font-medium">AI not configured</span>
            </div>
          )}
          {providerConfigured === true && (
            <div className="ml-auto flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-700 font-medium">AI ready</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {/* Empty state */}
          {isEmptyState && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-[#C99A3D]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#173F35] mb-2">✨ Doubt Buddy</h2>
              <p className="text-stone-500 text-sm mb-1">Ask anything you're stuck on.</p>
              <p className="text-stone-400 text-sm mb-8">I'll help you understand it! 🎯</p>

              {/* Starter prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  { icon: '🔢', text: 'Explain quadratic equations step by step' },
                  { icon: '⚡', text: 'What is Ohm\'s Law and how does it work?' },
                  { icon: '🧪', text: 'Summarize the carbon cycle for Class 9' },
                  { icon: '📐', text: 'Help me solve: 2x² + 5x - 3 = 0' },
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(prompt.text)}
                    className="flex items-start gap-3 p-3 bg-white border border-[#EDE6D8] rounded-xl hover:border-[#C99A3D] hover:bg-[#FAF6EE] transition-all text-left group"
                  >
                    <span className="text-xl">{prompt.icon}</span>
                    <span className="text-xs text-stone-600 font-medium group-hover:text-[#173F35]">{prompt.text}</span>
                  </button>
                ))}
              </div>

              {providerConfigured === false && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-lg">
                  <p className="text-sm text-amber-800">
                    <strong>⚙️ AI provider not configured.</strong> Contact your administrator to set up AI credentials. The interface is fully ready to use once configured.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Conversation messages */}
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onSpeak={(content) => handleSpeak(content, msg.id)}
              isSpeaking={isSpeaking && speakingMessageId === msg.id}
              onAskTeacher={handleAskTeacher}
            />
          ))}

          {/* Thinking bubble */}
          {isThinking && <ThinkingBubble inputType={thinkingInputType} />}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}

          {/* Voice error */}
          {voiceError && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700">{voiceError}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Area ─────────────────────────────────────────────────── */}
        <div className="border-t border-[#EDE6D8] bg-white px-4 py-3 space-y-3">
          {/* Quick mode pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {QUICK_MODES.map(qm => (
              <button
                key={qm.mode}
                onClick={() => handleQuickMode(qm.mode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  activeMode === qm.mode
                    ? `${qm.color} ring-2 ring-offset-1 ring-[#C99A3D]`
                    : `bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100`
                }`}
              >
                {qm.icon}
                {qm.label}
              </button>
            ))}
            {activeMode !== 'normal' && (
              <button
                onClick={() => setActiveMode('normal')}
                className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* File preview */}
          {pendingFile && (
            <div className="flex items-center gap-3 bg-[#F7F3EA] border border-[#E6DDCF] rounded-xl px-3 py-2">
              {pendingFilePreview ? (
                <img src={pendingFilePreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
              ) : (
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#173F35]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#173F35] truncate">{pendingFile.name}</p>
                <p className="text-[10px] text-stone-500">{(pendingFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={clearPendingFile} className="p-1 rounded hover:bg-red-50 text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Voice live indicator */}
          {isListening && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-700 font-medium">Listening...</span>
              {interimTranscript && <span className="text-xs text-red-500 italic truncate">{interimTranscript}</span>}
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-2">
            {/* File attach button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#F7F3EA] border border-stone-200 text-stone-500 hover:text-[#173F35] transition-all flex-shrink-0"
              title="Attach image or document"
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,audio/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your doubt, paste a problem, or describe a concept you're stuck on…"
              rows={1}
              className="flex-1 resize-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#173F35] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C99A3D]/30 focus:border-[#C99A3D] transition-all max-h-40 min-h-[42px]"
              style={{ height: 'auto' }}
              onInput={e => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 160) + 'px';
              }}
              disabled={isThinking}
            />

            {/* Voice button */}
            {voiceSupported && (
              <button
                onClick={handleVoiceToggle}
                className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 border-red-500 text-white animate-pulse'
                    : 'bg-stone-50 hover:bg-[#F7F3EA] border-stone-200 text-stone-500 hover:text-[#173F35]'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={isThinking || (!inputText.trim() && !pendingFile)}
              className="p-2.5 rounded-xl bg-gradient-to-br from-[#173F35] to-[#2E6B57] text-white border-0 hover:from-[#0E2822] hover:to-[#173F35] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
              title="Send"
            >
              {isThinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-[10px] text-stone-400 text-center">
            Doubt Buddy can make mistakes. For critical academic queries, always verify with your teacher.
          </p>
        </div>
      </div>
    </div>
  );
};
