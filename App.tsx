import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";

type Tab = "feed" | "search" | "post" | "profile";

type Post = {
  id: string;
  author: string;
  anonymous: boolean;
  text: string;
  location: string;
  reactions: {
    fire: number;
    heart: number;
    laugh: number;
    comments: number;
  };
};

export default function App() {
  const [tab, setTab] = useState<Tab>("feed");
  const [selectedArea, setSelectedArea] = useState("Long Beach");
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("howie");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Anonymous",
      anonymous: true,
      text: "Anyone know what’s happening downtown tonight?",
      location: "Long Beach",
      reactions: { fire: 12, heart: 8, laugh: 3, comments: 4 },
    },
    {
      id: "2",
      author: "@howie",
      anonymous: false,
      text: "Looking for a good coffee shop to work from near the beach.",
      location: "Long Beach",
      reactions: { fire: 5, heart: 14, laugh: 2, comments: 6 },
    },
  ]);

  function addPost(text: string, anonymous: boolean) {
    const newPost: Post = {
      id: Date.now().toString(),
      author: anonymous ? "Anonymous" : `@${username}`,
      anonymous,
      text,
      location: selectedArea,
      reactions: { fire: 0, heart: 0, laugh: 0, comments: 0 },
    };

    setPosts([newPost, ...posts]);
    setTab("feed");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>CityPeak</Text>
        <Text style={styles.subtitle}>Local posts by city or ZIP</Text>
      </View>

      {tab === "feed" && (
        <FeedScreen posts={posts} selectedArea={selectedArea} />
      )}

      {tab === "search" && (
        <SearchScreen
          search={search}
          setSearch={setSearch}
          setSelectedArea={setSelectedArea}
          setTab={setTab}
        />
      )}

      {tab === "post" && <CreatePostScreen addPost={addPost} />}

      {tab === "profile" && (
        <ProfileScreen username={username} setUsername={setUsername} />
      )}

      <BottomNav tab={tab} setTab={setTab} />
    </SafeAreaView>
  );
}

function FeedScreen({
  posts,
  selectedArea,
}: {
  posts: Post[];
  selectedArea: string;
}) {
  const filteredPosts = posts.filter((post) => post.location === selectedArea);

  return (
    <FlatList
      data={filteredPosts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.feedList}
      ListHeaderComponent={
        <View style={styles.areaCard}>
          <Text style={styles.areaLabel}>Current Area</Text>
          <Text style={styles.areaText}>{selectedArea}</Text>
          <Text style={styles.areaSubtext}>
            Anonymous and public posts from this area.
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No posts here yet</Text>
          <Text style={styles.muted}>Create the first post for this area.</Text>
        </View>
      }
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.anonymous ? "?" : post.author.replace("@", "")[0]}
          </Text>
        </View>

        <View>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.location}>{post.location}</Text>
        </View>
      </View>

      <Text style={styles.postText}>{post.text}</Text>

      <View style={styles.reactionRow}>
        <Text style={styles.reaction}>🔥 {post.reactions.fire}</Text>
        <Text style={styles.reaction}>❤️ {post.reactions.heart}</Text>
        <Text style={styles.reaction}>😂 {post.reactions.laugh}</Text>
        <Text style={styles.reaction}>💬 {post.reactions.comments}</Text>
      </View>
    </View>
  );
}

function SearchScreen({
  search,
  setSearch,
  setSelectedArea,
  setTab,
}: {
  search: string;
  setSearch: (value: string) => void;
  setSelectedArea: (value: string) => void;
  setTab: (tab: Tab) => void;
}) {
  const popularAreas = [
    "Long Beach",
    "Los Angeles",
    "90802",
    "Irvine",
    "Santa Monica",
    "San Diego",
  ];

  function chooseArea(value: string) {
    setSelectedArea(value);
    setSearch("");
    setTab("feed");
  }

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.screenTitle}>Search city or ZIP</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Long Beach or 90802"
        placeholderTextColor="#64748B"
        value={search}
        onChangeText={setSearch}
      />

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          if (search.trim()) chooseArea(search.trim());
        }}
      >
        <Text style={styles.primaryButtonText}>View Feed</Text>
      </Pressable>

      <Text style={styles.smallTitle}>Popular Areas</Text>

      <View style={styles.chipWrap}>
        {popularAreas.map((area) => (
          <Pressable
            key={area}
            style={styles.chip}
            onPress={() => chooseArea(area)}
          >
            <Text style={styles.chipText}>{area}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function CreatePostScreen({
  addPost,
}: {
  addPost: (text: string, anonymous: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Create Post</Text>

      <TextInput
        style={styles.textArea}
        placeholder="What's happening locally?"
        placeholderTextColor="#64748B"
        multiline
        value={text}
        onChangeText={setText}
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Post anonymously</Text>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          if (text.trim()) {
            addPost(text.trim(), anonymous);
            setText("");
          }
        }}
      >
        <Text style={styles.primaryButtonText}>Publish</Text>
      </Pressable>
    </View>
  );
}

function ProfileScreen({
  username,
  setUsername,
}: {
  username: string;
  setUsername: (value: string) => void;
}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>
            {username[0]?.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.profileName}>@{username}</Text>
        <Text style={styles.muted}>Used when you choose not to post anonymously.</Text>
      </View>

      <Text style={styles.smallTitle}>Username</Text>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor="#64748B"
      />
    </View>
  );
}

function BottomNav({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  const items: { key: Tab; label: string }[] = [
    { key: "feed", label: "🏠 Feed" },
    { key: "search", label: "🔍 Search" },
    { key: "post", label: "➕ Post" },
    { key: "profile", label: "👤 Profile" },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => (
        <Pressable key={item.key} onPress={() => setTab(item.key)}>
          <Text
            style={[
              styles.navItem,
              tab === item.key && styles.navItemActive,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: 18,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  logo: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: "#94A3B8",
    marginTop: 4,
  },
  feedList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  screenTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 16,
  },
  areaCard: {
    backgroundColor: "#0F172A",
    padding: 18,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  areaLabel: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  areaText: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  areaSubtext: {
    color: "#94A3B8",
    marginTop: 6,
  },
  postCard: {
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "900",
  },
  author: {
    color: "white",
    fontWeight: "800",
  },
  location: {
    color: "#64748B",
    fontSize: 12,
  },
  postText: {
    color: "white",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 14,
  },
  reactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reaction: {
    color: "#E2E8F0",
    backgroundColor: "#111827",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    overflow: "hidden",
  },
  input: {
    backgroundColor: "#0F172A",
    color: "white",
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: "#0F172A",
    color: "white",
    minHeight: 180,
    padding: 15,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1E293B",
    textAlignVertical: "top",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  smallTitle: {
    color: "white",
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  chipText: {
    color: "#E2E8F0",
    fontWeight: "800",
  },
  switchRow: {
    marginTop: 18,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    color: "white",
    fontWeight: "800",
  },
  profileCard: {
    backgroundColor: "#0F172A",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileAvatarText: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
  },
  profileName: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },
  muted: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: "#0F172A",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  emptyTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#0F172A",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navItem: {
    color: "#64748B",
    fontWeight: "800",
    fontSize: 12,
  },
  navItemActive: {
    color: "#38BDF8",
  },
});