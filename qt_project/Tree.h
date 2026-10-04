#ifndef TREE_H
#define TREE_H

#include "Resource.h"
#include <vector>

struct TreeNode {
    Resource data;
    TreeNode* left;
    TreeNode* right;
    TreeNode(Resource val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
private:
    TreeNode* root;

    TreeNode* insertRec(TreeNode* node, const Resource& res);
    void inorderRec(TreeNode* node, std::vector<Resource>& list) const;
    void preorderRec(TreeNode* node, std::vector<Resource>& list) const;
    void postorderRec(TreeNode* node, std::vector<Resource>& list) const;
    void destroyRec(TreeNode* node);
    Resource* searchRec(TreeNode* node, const std::string& id) const;

public:
    BST();
    ~BST();

    void insert(const Resource& res);
    Resource* search(const std::string& id) const;
    std::vector<Resource> inorder() const;
    std::vector<Resource> preorder() const;
    std::vector<Resource> postorder() const;
    void clear();
};

#endif // TREE_H
