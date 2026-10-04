#include "Tree.h"

BST::BST() : root(nullptr) {}

BST::~BST() {
    clear();
}

void BST::clear() {
    destroyRec(root);
    root = nullptr;
}

void BST::destroyRec(TreeNode* node) {
    if (node) {
        destroyRec(node->left);
        destroyRec(node->right);
        delete node;
    }
}

void BST::insert(const Resource& res) {
    root = insertRec(root, res);
}

TreeNode* BST::insertRec(TreeNode* node, const Resource& res) {
    if (!node) return new TreeNode(res);
    if (res.getResourceID() < node->data.getResourceID()) {
        node->left = insertRec(node->left, res);
    } else if (res.getResourceID() > node->data.getResourceID()) {
        node->right = insertRec(node->right, res);
    } else {
        node->data = res;
    }
    return node;
}

Resource* BST::search(const std::string& id) const {
    return searchRec(root, id);
}

Resource* BST::searchRec(TreeNode* node, const std::string& id) const {
    if (!node) return nullptr;
    if (node->data.getResourceID() == id) return &(node->data);
    if (id < node->data.getResourceID()) return searchRec(node->left, id);
    return searchRec(node->right, id);
}

std::vector<Resource> BST::inorder() const {
    std::vector<Resource> list;
    inorderRec(root, list);
    return list;
}

void BST::inorderRec(TreeNode* node, std::vector<Resource>& list) const {
    if (node) {
        inorderRec(node->left, list);
        list.push_back(node->data);
        inorderRec(node->right, list);
    }
}

std::vector<Resource> BST::preorder() const {
    std::vector<Resource> list;
    preorderRec(root, list);
    return list;
}

void BST::preorderRec(TreeNode* node, std::vector<Resource>& list) const {
    if (node) {
        list.push_back(node->data);
        preorderRec(node->left, list);
        preorderRec(node->right, list);
    }
}

std::vector<Resource> BST::postorder() const {
    std::vector<Resource> list;
    postorderRec(root, list);
    return list;
}

void BST::postorderRec(TreeNode* node, std::vector<Resource>& list) const {
    if (node) {
        postorderRec(node->left, list);
        postorderRec(node->right, list);
        list.push_back(node->data);
    }
}
